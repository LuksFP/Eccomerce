import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useProducts } from "@/context/ProductsContext";
import { Input } from "@/components/ui/input";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import { VoiceSearchButton } from "./VoiceSearchButton";

type SearchAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchAutocomplete = ({ value, onChange }: SearchAutocompleteProps) => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 2) return [];
    
    const searchLower = value.toLowerCase();
    return products
      .filter((product) => 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
      .slice(0, 6);
  }, [value, products]);

  const recentSearches = useMemo(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored).slice(0, 3) : [];
  }, []);

  const saveRecentSearch = (term: string) => {
    const stored = localStorage.getItem("recentSearches");
    const searches = stored ? JSON.parse(stored) : [];
    const updated = [term, ...searches.filter((s: string) => s !== term)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelectProduct(suggestions[highlightedIndex].id);
        } else if (value.trim()) {
          saveRecentSearch(value.trim());
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      saveRecentSearch(product.name);
    }
    setIsOpen(false);
    navigate(`/produto/${productId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (value.length >= 2 || recentSearches.length > 0) {
      setIsOpen(true);
    }
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    onChange(text);
    setIsOpen(true);
  }, [onChange]);

  const showSuggestions = isOpen && (suggestions.length > 0 || (recentSearches.length > 0 && !value));

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar produtos..."
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="pl-11 pr-20 h-12 glass border-border/30 rounded-xl focus:border-primary/50 transition-colors"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <VoiceSearchButton onTranscript={handleVoiceTranscript} />
          {value && (
            <button
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl glass border border-border/30 shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {!value && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Buscas recentes
                </p>
              </div>
              {recentSearches.map((term: string, index: number) => (
                <button
                  key={term}
                  onClick={() => {
                    onChange(term);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{term}</span>
                </button>
              ))}
            </>
          )}

          {suggestions.length > 0 && (
            <>
              {value && (
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Sugestões
                  </p>
                </div>
              )}
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                    index === highlightedIndex
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </>
          )}

          {value.length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum produto encontrado para "{value}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCategory, SortOption, FilterState, categoryLabels } from "@/types/product";
import { X, SlidersHorizontal } from "lucide-react";
import { SearchAutocomplete } from "./SearchAutocomplete";

type FiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  resultsCount: number;
};

export const Filters = ({ filters, onFilterChange, resultsCount }: FiltersProps) => {
  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.sortBy !== "price-asc";

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "all",
      sortBy: "price-asc",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search with Autocomplete */}
      <SearchAutocomplete
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
      />

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        {/* Filters container */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Category */}
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onFilterChange({ category: value as ProductCategory | "all" })
            }
          >
            <SelectTrigger className="w-full sm:w-[160px] h-10 glass border-border/30 rounded-xl">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="glass border-border/30">
              <SelectItem value="all">Todas categorias</SelectItem>
              {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange({ sortBy: value as SortOption })}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-10 glass border-border/30 rounded-xl">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="glass border-border/30">
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="name-asc">Nome A-Z</SelectItem>
              <SelectItem value="name-desc">Nome Z-A</SelectItem>
              <SelectItem value="rating-desc">Melhor avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}

        {/* Results count */}
        <div className="sm:ml-auto text-sm text-muted-foreground order-first sm:order-last w-full sm:w-auto text-right">
          <span className="font-medium text-foreground">{resultsCount}</span> {resultsCount === 1 ? "produto" : "produtos"}
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/utils/formatPrice";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PriceRatingFiltersProps = {
  priceRange: [number, number];
  maxPrice: number;
  minRating: number;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
};

const RATING_OPTIONS = [5, 4, 3, 2, 1, 0];

export const PriceRatingFilters = ({
  priceRange,
  maxPrice,
  minRating,
  onPriceChange,
  onRatingChange,
}: PriceRatingFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFilters = priceRange[0] > 0 || priceRange[1] < maxPrice || minRating > 0;

  return (
    <div className="glass rounded-xl border border-border/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>Filtros avançados</span>
          {hasFilters && (
            <Badge variant="secondary" className="text-xs">
              Ativos
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 border-t border-border/30 pt-4">
          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Faixa de Preço</Label>
              <span className="text-xs text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceChange(value as [number, number])}
              max={maxPrice}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Avaliação mínima</Label>
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRatingChange(rating)}
                  className={cn(
                    "gap-1.5 h-8",
                    minRating === rating && "glow"
                  )}
                >
                  {rating === 0 ? (
                    "Todas"
                  ) : (
                    <>
                      {rating}
                      <Star className="h-3 w-3 fill-current" />
                      {rating < 5 && "+"}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onPriceChange([0, maxPrice]);
                onRatingChange(0);
              }}
              className="w-full text-muted-foreground"
            >
              Limpar filtros avançados
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

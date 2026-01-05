import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCategory, SortOption, FilterState, categoryLabels } from "@/types/product";
import { Search, X, SlidersHorizontal } from "lucide-react";

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
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-10 pr-10 h-11 bg-card border-border/50"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        {/* Filters container - full width on mobile */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Category */}
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onFilterChange({ category: value as ProductCategory | "all" })
            }
          >
            <SelectTrigger className="w-full sm:w-[160px] h-9 bg-card border-border/50">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-card border-border/50">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="name-asc">Nome A-Z</SelectItem>
              <SelectItem value="name-desc">Nome Z-A</SelectItem>
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
          {resultsCount} {resultsCount === 1 ? "produto" : "produtos"}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterState, ProductCategory, SortOption } from "@/types/product";
import { useProducts } from "@/context/ProductsContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ProductList } from "@/components/ProductList";
import { Cart } from "@/components/Cart";
import { HeroSection, CategoryGrid, FeaturesBar } from "@/components/home";
import { SectionHeader } from "@/components/shared";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  
  useOrderNotifications();
  
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as ProductCategory | "all") || "all",
    sortBy: (searchParams.get("sort") as SortOption) || "price-asc",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.sortBy !== "price-asc") params.set("sort", filters.sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters.category, filters.sortBy, setSearchParams]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [products, debouncedSearch, filters.category, filters.sortBy]);

  const showHero = !filters.search && filters.category === "all";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main>
        {showHero && (
          <>
            <HeroSection />
            <FeaturesBar />
            <CategoryGrid />
          </>
        )}

        {/* Products Section */}
        <section className={showHero ? "py-12 sm:py-16 lg:py-20" : "py-8"}>
          <div className="container">
            {showHero && (
              <SectionHeader
                badge="Produtos"
                title="Todos os"
                highlight="Produtos"
                description="Explore nossa coleção completa de produtos selecionados especialmente para você"
                className="mb-10"
              />
            )}

            <div className="mb-6">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                resultsCount={filteredProducts.length}
              />
            </div>

            <ProductList products={filteredProducts} isLoading={isLoading} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 glass-subtle mt-16">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Loja<span className="text-gradient">Elegante</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Projeto de portfólio – E-commerce React + TypeScript
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LojaElegante. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
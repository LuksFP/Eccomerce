import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Product, FilterState, ProductCategory, SortOption } from "@/types/product";
import { fetchProducts } from "@/data/products";
import { useDebounce } from "@/hooks/useDebounce";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ProductList } from "@/components/ProductList";
import { Cart } from "@/components/Cart";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as ProductCategory | "all") || "all",
    sortBy: (searchParams.get("sort") as SortOption) || "price-asc",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.sortBy !== "price-asc") params.set("sort", filters.sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters.category, filters.sortBy, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    // Sort
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent to-secondary p-8 md:p-12">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Nova Coleção</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Descubra Produtos<br />
                <span className="text-primary">Exclusivos</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Explore nossa seleção curada de eletrônicos, moda e acessórios 
                com os melhores preços e qualidade garantida.
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            resultsCount={filteredProducts.length}
          />
        </section>

        {/* Products */}
        <section>
          <ProductList products={filteredProducts} isLoading={isLoading} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card mt-16">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 LojaElegante. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Projeto de portfólio – E-commerce React + TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

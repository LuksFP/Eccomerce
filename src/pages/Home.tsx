import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterState, ProductCategory, SortOption } from "@/types/product";
import { useProducts } from "@/context/ProductsContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { Header } from "@/components/Header";
import { Filters, PriceRatingFilters } from "@/components/Filters";
import { ProductList } from "@/components/ProductList";
import { Cart } from "@/components/Cart";
import {
  HeroSection,
  CategoryGrid,
  FeaturesBar,
  CouponsSection,
  MarqueeTicker,
  FeaturedStrip,
  TestimonialsSection,
  PromoBanner,
  NewsletterSection,
  FooterSection,
} from "@/components/home";
import { SectionHeader } from "@/components/shared";
import { RecommendedProducts } from "@/components/Recommendations";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();

  useOrderNotifications();

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100;
  }, [products]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as ProductCategory | "all") || "all",
    sortBy: (searchParams.get("sort") as SortOption) || "price-asc",
    priceRange: [0, maxPrice],
    minRating: 0,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], Math.min(prev.priceRange[1], maxPrice) || maxPrice],
    }));
  }, [maxPrice]);

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

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterState>) => setFilters((prev) => ({ ...prev, ...newFilters })),
    []
  );
  const handlePriceChange = useCallback(
    (priceRange: [number, number]) => setFilters((prev) => ({ ...prev, priceRange })),
    []
  );
  const handleRatingChange = useCallback(
    (minRating: number) => setFilters((prev) => ({ ...prev, minRating })),
    []
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(s));
    }
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "rating-desc": return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });
    return result;
  }, [products, debouncedSearch, filters.category, filters.sortBy, filters.priceRange, filters.minRating]);

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
            <MarqueeTicker />
            <FeaturedStrip />
            <PromoBanner />
            <CategoryGrid />
            <TestimonialsSection />
            <CouponsSection />
            <RecommendedProducts />
            <NewsletterSection />
          </>
        )}

        {/* Products catalogue */}
        <section className={showHero ? "py-12 sm:py-16 lg:py-20" : "py-8"}>
          <div className="container">
            {showHero && (
              <SectionHeader
                badge="Catálogo"
                title="Todos os"
                highlight="Produtos"
                description="Explore nossa seleção completa de produtos certificados para performance e bem-estar"
                className="mb-10"
              />
            )}

            <div className="space-y-4 mb-6">
              <Filters filters={filters} onFilterChange={handleFilterChange} resultsCount={filteredProducts.length} />
              <PriceRatingFilters
                priceRange={filters.priceRange}
                maxPrice={maxPrice}
                minRating={filters.minRating}
                onPriceChange={handlePriceChange}
                onRatingChange={handleRatingChange}
              />
            </div>

            <ProductList products={filteredProducts} isLoading={isLoading} />
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default Home;

import { useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/shared";
import { Sparkles } from "lucide-react";

export const RecommendedProducts = () => {
  const { products } = useProducts();
  const { getViewedProductIds, getMostViewedCategories, history } = useBrowsingHistory();

  const recommendations = useMemo(() => {
    const viewedIds = getViewedProductIds();
    const topCategories = getMostViewedCategories();

    if (history.length === 0) {
      // No history - show top rated products
      return products
        .filter((p) => p.stock > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
    }

    // Filter out viewed products and prioritize by category
    const notViewed = products.filter(
      (p) => !viewedIds.includes(p.id) && p.stock > 0
    );

    // Score products based on category preference
    const scored = notViewed.map((product) => {
      const categoryIndex = topCategories.indexOf(product.category);
      const categoryScore = categoryIndex >= 0 ? (topCategories.length - categoryIndex) * 10 : 0;
      const ratingScore = (product.rating || 0) * 2;
      const discountScore = product.originalPrice ? 5 : 0;
      
      return {
        product,
        score: categoryScore + ratingScore + discountScore,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product);
  }, [products, getViewedProductIds, getMostViewedCategories, history]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container">
        <SectionHeader
          badge={
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Para Você
            </span>
          }
          title="Recomendados"
          highlight="Para Você"
          description={
            history.length > 0
              ? "Produtos selecionados com base no seu histórico de navegação"
              : "Nossos produtos mais bem avaliados"
          }
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

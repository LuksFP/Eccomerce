import { Link } from "react-router-dom";
import { Product, categoryLabels } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewsContext";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { CompareButton } from "@/components/Compare";
import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";
import { motion } from "framer-motion";

type ProductCardProps = {
  product: Product;
};

const categoryAccent: Record<string, string> = {
  suplementos: "bg-primary text-primary-foreground",
  fitness: "bg-[hsl(28_96%_58%)] text-black",
  "bem-estar": "bg-[hsl(270_80%_68%)] text-white",
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { getProductStats } = useReviews();
  const { addToHistory } = useBrowsingHistory();

  const reviewStats = getProductStats(product.id);
  const isOutOfStock = product.stock === 0;
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;
  const quantityInCart = getItemQuantity(product.id);
  const canAddMore = quantityInCart < product.stock;
  const isFav = isFavorite(product.id);
  const rating =
    reviewStats.totalReviews > 0
      ? reviewStats.averageRating
      : product.rating || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && canAddMore) addItem(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) toggleFavorite(product.id);
  };

  return (
    <Link
      to={`/produto/${product.id}`}
      onClick={() => addToHistory(product.id, product.category)}
      className="block group"
    >
      <article className="relative overflow-hidden rounded-2xl bg-secondary/30 border border-border/20">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
            style={{ transform: "scale(1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          {/* Gradient overlay always present, stronger on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-400 opacity-70 group-hover:opacity-90" />

          {/* Category pill — top left */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${categoryAccent[product.category] ?? "bg-muted text-muted-foreground"}`}>
              {categoryLabels[product.category]}
            </span>
          </div>

          {/* Discount + stock — top right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {discount > 0 && !isOutOfStock && (
              <span className="text-[10px] font-black bg-destructive text-white px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] font-bold bg-black/70 text-muted-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
                Esgotado
              </span>
            )}
          </div>

          {/* Actions — favorite + compare — right side */}
          <div className="absolute right-3 bottom-24 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border ${
                  isFav
                    ? "bg-destructive border-destructive text-white"
                    : "bg-black/40 border-white/10 text-white hover:bg-destructive hover:border-destructive"
                }`}
                aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
              >
                <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
              </button>
            )}
            <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <CompareButton product={product} />
            </div>
          </div>

          {/* Bottom overlay — name + price + CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-1 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2.5 w-2.5 ${
                      i < Math.floor(rating) ? "fill-warning text-warning" : "fill-white/20 text-white/20"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-white/60 ml-1">{rating.toFixed(1)}</span>
              </div>
            )}

            <h3 className="font-display font-bold text-white text-sm sm:text-base leading-tight line-clamp-2 mb-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-black text-primary text-base sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-white/40 line-through ml-2">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock || !canAddMore}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isOutOfStock || !canAddMore
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {isOutOfStock ? "Esgotado" : !canAddMore ? "Max" : "Carrinho"}
              </motion.button>
            </div>

            {/* Low stock warning */}
            {!isOutOfStock && product.stock <= 5 && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                <span className="text-[10px] text-warning font-medium">
                  Só {product.stock} restante{product.stock > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

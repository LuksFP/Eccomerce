import { Link } from "react-router-dom";
import { Product, categoryLabels, categoryBadgeVariant } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/utils/formatPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewsContext";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { CompareButton } from "@/components/Compare";
import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";

type ProductCardProps = {
  product: Product;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && canAddMore) {
      addItem(product);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(product.id);
    }
  };

  const handleCardClick = () => {
    addToHistory(product.id, product.category);
  };

  const rating = reviewStats.totalReviews > 0 
    ? reviewStats.averageRating 
    : product.rating || 0;
  const reviewCount = reviewStats.totalReviews || 0;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group block product-card-hover"
      onClick={handleCardClick}
    >
      <article className="glass rounded-2xl overflow-hidden border border-border/30 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover image-zoom"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock && (
              <Badge variant="out-of-stock" className="text-xs backdrop-blur-sm">
                Esgotado
              </Badge>
            )}
            {discount > 0 && !isOutOfStock && (
              <Badge variant="destructive" className="text-xs font-bold">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={categoryBadgeVariant[product.category]} 
              className="text-xs backdrop-blur-sm"
            >
              {categoryLabels[product.category]}
            </Badge>
          </div>

          {/* Action buttons overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {/* Quick view and Compare */}
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer">
                <Eye className="h-4 w-4" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                <CompareButton product={product} />
              </div>
            </div>

            {/* Favorite */}
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                  isFav
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-card/90 text-muted-foreground hover:text-destructive hover:bg-card"
                }`}
                aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? "fill-warning text-warning"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {rating.toFixed(1)}
                {reviewCount > 0 && ` (${reviewCount})`}
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-medium text-sm sm:text-base text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 flex-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-gradient">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock warning */}
          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-xs text-warning mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              Apenas {product.stock} restantes
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            variant={isOutOfStock ? "secondary" : "cart"}
            size="sm"
            className="w-full font-medium"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !canAddMore}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock
              ? "Esgotado"
              : !canAddMore
              ? "Máximo atingido"
              : "Adicionar ao Carrinho"}
          </Button>
        </div>
      </article>
    </Link>
  );
};
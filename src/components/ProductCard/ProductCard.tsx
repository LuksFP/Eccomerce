import { Link } from "react-router-dom";
import { Product, categoryLabels, categoryBadgeVariant } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/utils/formatPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Eye } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, getItemQuantity } = useCart();
  const isOutOfStock = product.stock === 0;
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;
  const quantityInCart = getItemQuantity(product.id);
  const canAddMore = quantityInCart < product.stock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && canAddMore) {
      addItem(product);
    }
  };

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group block product-card-hover"
    >
      <article className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover image-zoom"
            loading="lazy"
          />
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock && (
              <Badge variant="out-of-stock" className="text-xs">
                Sem Estoque
              </Badge>
            )}
            {discount > 0 && !isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={categoryBadgeVariant[product.category]} className="text-xs">
              {categoryLabels[product.category]}
            </Badge>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto mb-3">
            <span className="text-lg font-bold text-card-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock info */}
          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-xs text-warning mb-3">
              Apenas {product.stock} em estoque
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            variant={isOutOfStock ? "secondary" : "cart"}
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !canAddMore}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock
              ? "Indisponível"
              : !canAddMore
              ? "Máximo no carrinho"
              : "Adicionar"}
          </Button>
        </div>
      </article>
    </Link>
  );
};

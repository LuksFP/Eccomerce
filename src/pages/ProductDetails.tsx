import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoryLabels, categoryBadgeVariant } from "@/types/product";
import { useProducts } from "@/context/ProductsContext";
import { useReviews } from "@/context/ReviewsContext";
import { formatPrice, calculateDiscount } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { ReviewForm, ReviewsList } from "@/components/Reviews";
import { ImageGallery } from "@/components/ProductDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Minus,
  Plus,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const ProductSkeleton = () => (
  <div className="container py-8">
    <div className="h-6 w-32 bg-muted shimmer rounded mb-8" />
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="aspect-square bg-muted shimmer rounded-2xl" />
      <div className="space-y-4">
        <div className="h-8 w-24 bg-muted shimmer rounded" />
        <div className="h-10 w-3/4 bg-muted shimmer rounded" />
        <div className="h-6 w-1/2 bg-muted shimmer rounded" />
        <div className="h-20 w-full bg-muted shimmer rounded" />
        <div className="h-12 w-full bg-muted shimmer rounded" />
      </div>
    </div>
  </div>
);

const NotFoundState = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Package className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
      <p className="text-muted-foreground mb-6">
        O produto que você está procurando não existe ou foi removido.
      </p>
      <Button onClick={() => navigate("/")}>Voltar para a loja</Button>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { getProductStats } = useReviews();
  const { addItem, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;
  const reviewStats = id ? getProductStats(id) : null;
  const quantityInCart = product ? getItemQuantity(product.id) : 0;
  const availableStock = product ? product.stock - quantityInCart : 0;
  const isOutOfStock = product?.stock === 0;
  const canAddMore = availableStock > 0;
  const isFav = product ? isFavorite(product.id) : false;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock || !canAddMore) return;
    
    const qtyToAdd = Math.min(quantity, availableStock);
    const productForCart = {
      ...product,
      description: product.description || "",
      rating: product.rating || 0,
      originalPrice: product.originalPrice,
    };
    for (let i = 0; i < qtyToAdd; i++) {
      addItem(productForCart);
    }
    setQuantity(1);
    
    // Notify user
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description || "",
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleToggleFavorite = () => {
    if (product && isAuthenticated) {
      toggleFavorite(product.id);
    }
  };

  const discount = product?.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ProductSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Cart />
        <NotFoundState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground -ml-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative">
            <ImageGallery mainImage={product.image} productName={product.name} />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {isOutOfStock && (
                <Badge variant="out-of-stock">Sem Estoque</Badge>
              )}
              {discount > 0 && !isOutOfStock && (
                <Badge variant="destructive">-{discount}%</Badge>
              )}
            </div>

            {/* Favorite button */}
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                  isFav
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-destructive"
                } shadow-lg`}
                aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
              </button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category */}
            <Badge variant={categoryBadgeVariant[product.category]}>
              {categoryLabels[product.category]}
            </Badge>

            {/* Name */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Rating */}
            {reviewStats && reviewStats.totalReviews > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(reviewStats.averageRating)
                          ? "fill-warning text-warning"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "avaliação" : "avaliações"})
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <Separator />

            {/* Stock info */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {isOutOfStock ? (
                <span className="text-sm text-destructive">
                  Produto indisponível
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-sm text-warning">
                  Últimas {product.stock} unidades!
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {product.stock} em estoque
                </span>
              )}
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setQuantity(Math.min(availableStock, quantity + 1))
                    }
                    disabled={quantity >= availableStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {quantityInCart > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({quantityInCart} no carrinho)
                  </span>
                )}
              </div>
            )}

            {/* Add to cart */}
            <Button
              variant={isOutOfStock ? "secondary" : "cart"}
              size="xl"
              className="w-full"
              onClick={handleAddToCart}
              disabled={isOutOfStock || !canAddMore}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock
                ? "Produto Indisponível"
                : !canAddMore
                ? "Limite atingido"
                : `Adicionar ao Carrinho`}
            </Button>

            <Separator />

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Frete Grátis</p>
                  <p className="text-xs text-muted-foreground">
                    Para todo Brasil
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Garantia</p>
                  <p className="text-xs text-muted-foreground">12 meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold">Avaliações</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <ReviewForm productId={product.id} />
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que os clientes dizem</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewsList productId={product.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;

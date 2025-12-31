import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product, categoryLabels, categoryBadgeVariant } from "@/types/product";
import { fetchProductById } from "@/data/products";
import { formatPrice, calculateDiscount } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Minus,
  Plus,
} from "lucide-react";

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

const NotFound = () => {
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
  const { addItem, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const quantityInCart = product ? getItemQuantity(product.id) : 0;
  const availableStock = product ? product.stock - quantityInCart : 0;
  const isOutOfStock = product?.stock === 0;
  const canAddMore = availableStock > 0;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data || null);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock || !canAddMore) return;
    
    const qtyToAdd = Math.min(quantity, availableStock);
    for (let i = 0; i < qtyToAdd; i++) {
      addItem(product);
    }
    setQuantity(1);
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
        <NotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground -ml-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isOutOfStock && (
                <Badge variant="out-of-stock">Sem Estoque</Badge>
              )}
              {discount > 0 && !isOutOfStock && (
                <Badge variant="destructive">-{discount}%</Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <Badge variant={categoryBadgeVariant[product.category]}>
              {categoryLabels[product.category]}
            </Badge>

            {/* Name */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!)
                          ? "fill-warning text-warning"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  (120 avaliações)
                </span>
              </div>
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
      </main>
    </div>
  );
};

export default ProductDetails;

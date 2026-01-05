import { useNavigate } from "react-router-dom";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCart();
  const canIncrease = item.quantity < item.product.stock;

  return (
    <div className="flex gap-4 py-4 group">
      {/* Image */}
      <Link
        to={`/produto/${item.product.id}`}
        className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/produto/${item.product.id}`}
          className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-primary font-semibold mt-1">
          {formatPrice(item.product.price)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center glass rounded-lg border border-border/30 overflow-hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className="h-8 w-8 rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              disabled={!canIncrease}
              className="h-8 w-8 rounded-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeItem(item.product.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right">
        <p className="font-bold text-sm text-foreground">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center mb-6">
      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="font-display text-xl font-bold mb-2">Carrinho vazio</h3>
    <p className="text-muted-foreground text-sm max-w-xs">
      Explore nossa coleção e adicione produtos ao seu carrinho
    </p>
  </div>
);

export const Cart = () => {
  const navigate = useNavigate();
  const { items, isOpen, setCartOpen, totalItems, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col glass border-border/30">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 font-display text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <span>
              Carrinho
              {totalItems > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </span>
              )}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y divide-border/30">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 space-y-4">
              <Separator className="bg-border/30" />
              
              {/* Summary */}
              <div className="space-y-3 glass-subtle rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-primary font-medium">Grátis</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gradient">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full glow group" size="lg" onClick={handleCheckout}>
                  Finalizar Compra
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  Limpar carrinho
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Cart trigger button for header
export const CartTrigger = () => {
  const { toggleCart, totalItems } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCart}
      className="relative hover-glow"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center cart-bounce glow">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
};
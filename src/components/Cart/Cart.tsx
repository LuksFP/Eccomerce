import { useNavigate } from "react-router-dom";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCart();
  const canIncrease = item.quantity < item.product.stock;

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link
        to={`/produto/${item.product.id}`}
        className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/produto/${item.product.id}`}
          className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          {formatPrice(item.product.price)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="h-7 w-7"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            disabled={!canIncrease}
            className="h-7 w-7"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeItem(item.product.id)}
            className="h-7 w-7 text-muted-foreground hover:text-destructive ml-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right">
        <p className="font-semibold text-sm">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
    <p className="text-muted-foreground text-sm mb-4">
      Adicione produtos para continuar
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
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 space-y-4">
              <Separator />
              
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-success">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="cart" className="w-full" size="lg" onClick={handleCheckout}>
                  Finalizar Compra
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-muted-foreground"
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
      className="relative"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center cart-bounce">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
};

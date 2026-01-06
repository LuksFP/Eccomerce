import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { ShippingAddress, PaymentMethod, paymentMethodLabels } from "@/types/order";
import { formatPrice } from "@/utils/formatPrice";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { ShippingCalculator } from "@/components/Shipping";
import { ShippingOption } from "@/hooks/useShipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  CreditCard,
  QrCode,
  FileText,
  ShoppingBag,
  Check,
  Loader2,
  AlertCircle,
  Package,
  Tag,
  X,
  Truck,
} from "lucide-react";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().trim().min(3, "Nome completo obrigatório").max(100),
  street: z.string().trim().min(3, "Rua obrigatória").max(200),
  number: z.string().trim().min(1, "Número obrigatório").max(10),
  complement: z.string().trim().max(100).optional(),
  neighborhood: z.string().trim().min(2, "Bairro obrigatório").max(100),
  city: z.string().trim().min(2, "Cidade obrigatória").max(100),
  state: z.string().trim().length(2, "UF deve ter 2 letras"),
  zipCode: z.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  phone: z.string().trim().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { items, totalPrice, totalItems } = useCart();
  const { createOrder, validateCoupon } = useOrders();

  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: profile?.name || "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  
  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Shipping state
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Calculate shipping and totals
  const shippingCost = selectedShipping?.price || (paymentMethod === "pix" ? 0 : 25);
  const pixDiscount = paymentMethod === "pix" ? totalPrice * 0.05 : 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, totalPrice + shippingCost - pixDiscount - couponDiscount);

  const handleShippingSelect = useCallback((option: ShippingOption | null) => {
    setSelectedShipping(option);
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setCouponLoading(true);
    setCouponError("");
    
    const result = await validateCoupon(couponInput.trim(), totalPrice);
    
    if (result.isValid) {
      setAppliedCoupon({
        code: result.code || couponInput.toUpperCase(),
        discount: result.discount,
        message: result.message,
      });
      toast({ title: "Cupom aplicado!", description: result.message });
      setCouponInput("");
    } else {
      setCouponError(result.message);
    }
    
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Redirect if not authenticated or cart is empty
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Cart />
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Faça login para continuar</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para finalizar a compra.
          </p>
          <Button onClick={() => navigate("/auth")}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Cart />
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Carrinho vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione produtos ao carrinho para continuar.
          </p>
          <Button onClick={() => navigate("/")}>Ir às Compras</Button>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = await createOrder(
      address, 
      paymentMethod, 
      appliedCoupon?.code, 
      couponDiscount + pixDiscount
    );

    if (order) {
      setOrderId(order.id);
      setStep("confirmation");
    }

    setIsLoading(false);
  };

  const renderAddressStep = () => (
    <form onSubmit={handleAddressSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              1
            </span>
            Endereço de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className={errors.zipCode ? "border-destructive" : ""}
              />
              {errors.zipCode && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.zipCode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className={errors.street ? "border-destructive" : ""}
              />
              {errors.street && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.street}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className={errors.number ? "border-destructive" : ""}
              />
              {errors.number && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, Bloco, etc."
                value={address.complement}
                onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className={errors.neighborhood ? "border-destructive" : ""}
              />
              {errors.neighborhood && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.neighborhood}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado (UF)</Label>
              <Input
                id="state"
                placeholder="SP"
                maxLength={2}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                className={errors.state ? "border-destructive" : ""}
              />
              {errors.state && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.state}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Calculator */}
      <ShippingCalculator
        onShippingSelect={handleShippingSelect}
        initialCep={address.zipCode}
      />

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Continuar para Pagamento
        </Button>
      </div>
    </form>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              2
            </span>
            Método de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            className="space-y-3"
          >
            <label
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "credit_card"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="credit_card" id="credit_card" />
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Cartão de Crédito</p>
                <p className="text-sm text-muted-foreground">
                  Parcele em até 12x sem juros
                </p>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "pix"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="pix" id="pix" />
              <QrCode className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">PIX</p>
                <p className="text-sm text-muted-foreground">
                  Pagamento instantâneo com desconto
                </p>
              </div>
              <span className="text-sm font-medium text-success">-5%</span>
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "boleto"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="boleto" id="boleto" />
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Boleto Bancário</p>
                <p className="text-sm text-muted-foreground">
                  Vencimento em 3 dias úteis
                </p>
              </div>
            </label>
          </RadioGroup>

          {paymentMethod === "credit_card" && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-4">
              <p className="text-sm font-medium">Dados do Cartão (Simulado)</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Número do Cartão</Label>
                  <Input placeholder="0000 0000 0000 0000" />
                </div>
                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input placeholder="000" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => setStep("address")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <Button
          onClick={handlePaymentSubmit}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-success" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-3">Pedido Confirmado!</h1>
      <p className="text-muted-foreground mb-6">
        Seu pedido <span className="font-mono font-medium">#{orderId?.slice(-6)}</span> foi
        realizado com sucesso.
      </p>

      <Card className="mb-6 text-left">
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método de Pagamento</span>
            <span className="font-medium">{paymentMethodLabels[paymentMethod]}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Endereço</span>
            <span className="font-medium text-right">
              {address.street}, {address.number}
              <br />
              {address.city} - {address.state}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate("/meus-pedidos")}>Ver Meus Pedidos</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Continuar Comprando
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === "address" && renderAddressStep()}
            {step === "payment" && renderPaymentStep()}
            {step === "confirmation" && renderConfirmation()}
          </div>

          {/* Order Summary */}
          {step !== "confirmation" && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Input */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-sm">
                      <Tag className="h-3 w-3" /> Cupom de Desconto
                    </Label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20">
                        <div>
                          <span className="font-mono text-sm font-medium text-success">{appliedCoupon.code}</span>
                          <p className="text-xs text-muted-foreground">{appliedCoupon.message}</p>
                        </div>
                        <Button variant="ghost" size="icon-sm" onClick={handleRemoveCoupon}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="CODIGO"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className={`flex-1 uppercase ${couponError ? "border-destructive" : ""}`}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                        >
                          {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-xs text-destructive">{couponError}</p>
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({totalItems} itens)
                      </span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Frete {selectedShipping ? `(${selectedShipping.name})` : ""}
                      </span>
                      <span className={shippingCost === 0 ? "text-success" : ""}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {selectedShipping && (
                      <p className="text-xs text-muted-foreground">
                        Entrega em {selectedShipping.days}
                      </p>
                    )}
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto PIX (5%)</span>
                        <span className="text-success">-{formatPrice(pixDiscount)}</span>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cupom ({appliedCoupon.code})</span>
                        <span className="text-success">-{formatPrice(appliedCoupon.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

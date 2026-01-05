import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/utils/formatPrice";
import { orderStatusLabels } from "@/types/order";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Box,
  XCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const orderSteps = [
  { status: "pending", label: "Pedido Confirmado", icon: Clock },
  { status: "processing", label: "Em Preparação", icon: Box },
  { status: "shipped", label: "Enviado", icon: Truck },
  { status: "delivered", label: "Entregue", icon: CheckCircle2 },
];

const getStepIndex = (status: string) => {
  if (status === "cancelled") return -1;
  const index = orderSteps.findIndex((s) => s.status === status);
  return index >= 0 ? index : 0;
};

const getEstimatedDelivery = (createdAt: Date, status: string) => {
  const created = new Date(createdAt);
  const estimated = new Date(created);
  
  switch (status) {
    case "pending":
      estimated.setDate(estimated.getDate() + 7);
      break;
    case "processing":
      estimated.setDate(estimated.getDate() + 5);
      break;
    case "shipped":
      estimated.setDate(estimated.getDate() + 2);
      break;
    case "delivered":
      return "Entregue";
    case "cancelled":
      return "Cancelado";
    default:
      estimated.setDate(estimated.getDate() + 7);
  }
  
  return estimated.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
};

const trackingEvents = [
  {
    status: "delivered",
    events: [
      { time: "14:32", date: "hoje", location: "Entregue", description: "Pedido entregue ao destinatário" },
      { time: "08:45", date: "hoje", location: "São Paulo, SP", description: "Saiu para entrega" },
      { time: "06:00", date: "hoje", location: "São Paulo, SP", description: "Chegou ao centro de distribuição" },
      { time: "22:15", date: "ontem", location: "Campinas, SP", description: "Em trânsito" },
      { time: "18:30", date: "2 dias atrás", location: "Centro de Distribuição", description: "Objeto postado" },
    ],
  },
  {
    status: "shipped",
    events: [
      { time: "08:45", date: "hoje", location: "Campinas, SP", description: "Em trânsito para destino" },
      { time: "22:15", date: "ontem", location: "Centro de Distribuição", description: "Objeto postado" },
      { time: "18:30", date: "2 dias atrás", location: "Loja", description: "Pedido despachado" },
    ],
  },
  {
    status: "processing",
    events: [
      { time: "10:00", date: "hoje", location: "Loja", description: "Pedido em preparação" },
      { time: "09:00", date: "ontem", location: "Sistema", description: "Pedido confirmado" },
    ],
  },
  {
    status: "pending",
    events: [
      { time: "09:00", date: "hoje", location: "Sistema", description: "Aguardando confirmação de pagamento" },
    ],
  },
];

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const order = orderId ? getOrderById(orderId) : undefined;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Cart />
        <main className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Não foi possível encontrar as informações deste pedido.
          </p>
          <Button asChild>
            <Link to="/meus-pedidos">Ver Meus Pedidos</Link>
          </Button>
        </main>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const progressPercentage = order.status === "cancelled" ? 0 : ((currentStep + 1) / orderSteps.length) * 100;
  const events = trackingEvents.find((t) => t.status === order.status)?.events || trackingEvents[3].events;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link to="/meus-pedidos">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos pedidos
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="glass">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Realizado em{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "success"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {orderStatusLabels[order.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {order.status === "cancelled" ? (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10">
                    <XCircle className="h-8 w-8 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Pedido Cancelado</p>
                      <p className="text-sm text-muted-foreground">
                        Este pedido foi cancelado e não será entregue.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Progress Bar */}
                    <Progress value={progressPercentage} className="h-2 mb-6" />

                    {/* Steps */}
                    <div className="grid grid-cols-4 gap-2">
                      {orderSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                          <div
                            key={step.status}
                            className={`flex flex-col items-center text-center ${
                              isCompleted ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground scale-110 shadow-glow"
                                  : isCompleted
                                  ? "bg-primary/20"
                                  : "bg-muted"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Estimated Delivery */}
                    <div className="mt-6 p-4 rounded-lg bg-primary/5 flex items-center gap-4">
                      <Truck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Previsão de Entrega</p>
                        <p className="text-lg font-bold text-primary">
                          {getEstimatedDelivery(order.createdAt, order.status)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            {order.status !== "cancelled" && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Histórico de Rastreamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {events.map((event, index) => (
                      <div key={index} className="flex gap-4 pb-6 last:pb-0">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-primary" : "bg-muted"
                            }`}
                          />
                          {index < events.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-1" />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 -mt-0.5">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium">{event.description}</span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Último
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.location} • {event.time} - {event.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.shippingAddress.street}, {order.shippingAddress.number}
                  {order.shippingAddress.complement &&
                    ` - ${order.shippingAddress.complement}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.neighborhood}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city} - {order.shippingAddress.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {order.shippingAddress.zipCode}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;

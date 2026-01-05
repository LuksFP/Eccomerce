import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/utils/formatPrice";
import { orderStatusLabels, paymentMethodLabels } from "@/types/order";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "success";
    case "shipped":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, logout } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const { favorites, removeFavorite } = useFavorites();
  const { products, getProductById } = useProducts();

  // Get favorite products from IDs
  const favoriteProducts = favorites
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (!isAuthenticated) {
    navigate("/auth", { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.name}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Pedidos</span>
                    </div>
                    <span className="text-sm font-medium">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Favoritos</span>
                    </div>
                    <span className="text-sm font-medium">{favoriteProducts.length}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  Meus Pedidos
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Favoritos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhum pedido encontrado
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Você ainda não fez nenhum pedido.
                      </p>
                      <Button onClick={() => navigate("/")}>Começar a Comprar</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader className="pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-base">
                                Pedido #{order.id.slice(-6)}
                              </CardTitle>
                              <Badge variant={getStatusBadgeVariant(order.status) as any}>
                                {orderStatusLabels[order.status]}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {order.items.slice(0, 4).map((item, i) => (
                              <img
                                key={i}
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ))}
                            {order.items.length > 4 && (
                              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">
                                  +{order.items.length - 4}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                {order.items.reduce((sum, i) => sum + i.quantity, 0)} itens •{" "}
                                {paymentMethodLabels[order.paymentMethod]}
                              </p>
                              <p className="font-semibold">{formatPrice(order.total)}</p>
                            </div>

                            <div className="flex gap-2">
                              {order.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelOrder(order.id)}
                                >
                                  Cancelar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites">
                {favoriteProducts.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhum favorito
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Adicione produtos aos favoritos para encontrá-los facilmente.
                      </p>
                      <Button onClick={() => navigate("/")}>Explorar Produtos</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteProducts.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Link to={`/produto/${product.id}`}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/produto/${product.id}`}
                                className="font-medium hover:text-primary transition-colors line-clamp-2"
                              >
                                {product.name}
                              </Link>
                              <p className="text-lg font-bold mt-1">
                                {formatPrice(product.price)}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFavorite(product.id)}
                                >
                                  Remover
                                </Button>
                                <Button size="sm" asChild>
                                  <Link to={`/produto/${product.id}`}>
                                    Ver
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrdersPage;

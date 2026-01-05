import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/utils/formatPrice";
import { categoryLabels, categoryBadgeVariant } from "@/types/product";
import { orderStatusLabels, Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowLeft,
  Shield,
  Edit,
  Minus,
  Plus,
  Database,
  Loader2,
} from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, profile } = useAuth();
  const { products, updateStock, seedProducts, isLoading: productsLoading } = useProducts();
  const { getAllOrders, updateOrderStatus } = useOrders();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [stockEditing, setStockEditing] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [seeding, setSeeding] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
      setOrdersLoading(false);
    };
    
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, getAllOrders]);

  // Redirect non-admins
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-xl font-bold mb-2">Acesso Restrito</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa ser um administrador para acessar esta página.
            </p>
            <Button onClick={() => navigate("/")}>Voltar à Loja</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.stock <= 5).length;

    return { totalRevenue, totalOrders, totalProducts, lowStock };
  }, [orders, products]);

  const handleStockSave = async (productId: string) => {
    await updateStock(productId, tempStock);
    setStockEditing(null);
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    await seedProducts();
    setSeeding(false);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    // Refresh orders
    const fetchedOrders = await getAllOrders();
    setOrders(fetchedOrders);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span className="font-display text-xl font-semibold">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Admin</Badge>
            <span className="text-sm text-muted-foreground">{profile?.email}</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Seed Products Button */}
        {products.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">Nenhum produto no banco de dados</h2>
              <p className="text-muted-foreground mb-4">
                Clique abaixo para popular o banco com produtos de demonstração.
              </p>
              <Button onClick={handleSeedProducts} disabled={seeding}>
                {seeding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Adicionar Produtos de Demonstração
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-category-electronics/10">
                  <ShoppingCart className="h-5 w-5 text-category-electronics" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-category-clothing/10">
                  <Package className="h-5 w-5 text-category-clothing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produtos</p>
                  <p className="text-xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                  <p className="text-xl font-bold">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum produto cadastrado.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span className="font-medium line-clamp-1">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={categoryBadgeVariant[product.category]}>
                              {categoryLabels[product.category]}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            {stockEditing === product.id ? (
                              <div className="flex items-center gap-2">
                                <Button size="icon-sm" variant="outline" onClick={() => setTempStock(Math.max(0, tempStock - 1))}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={tempStock}
                                  onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                                  className="w-16 h-8 text-center"
                                />
                                <Button size="icon-sm" variant="outline" onClick={() => setTempStock(tempStock + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className={product.stock <= 5 ? "text-warning font-medium" : ""}>
                                {product.stock}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {stockEditing === product.id ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleStockSave(product.id)}>Salvar</Button>
                                <Button size="sm" variant="outline" onClick={() => setStockEditing(null)}>Cancelar</Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => { setStockEditing(product.id); setTempStock(product.stock); }}>
                                <Edit className="h-4 w-4 mr-1" />Editar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum pedido ainda.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id.slice(-6)}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>{order.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                          <TableCell>{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(orderStatusLabels).map(([k, v]) => (
                                  <SelectItem key={k} value={k}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;

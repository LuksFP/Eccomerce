import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useProducts } from "@/context/ProductsContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { SalesDashboard, LowStockAlert, ExportReports, SalesTrendChart } from "@/components/Admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/formatPrice";
import {
  User,
  Package,
  Heart,
  Settings,
  Bell,
  Shield,
  Loader2,
  Save,
  Camera,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  BarChart3,
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, color: "warning" },
  processing: { label: "Processando", icon: Loader2, color: "primary" },
  shipped: { label: "Enviado", icon: Truck, color: "primary" },
  delivered: { label: "Entregue", icon: CheckCircle2, color: "success" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "destructive" },
} as const;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { orders, isLoading: ordersLoading } = useOrders();
  const { getAllOrders } = useOrders();
  const { favorites } = useFavorites();
  const { products } = useProducts();
  const { requestPushPermission } = useNotifications();
  const [allOrders, setAllOrders] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [settings, setSettings] = useState({
    pushNotifications: false,
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAdmin) {
      getAllOrders().then(setAllOrders);
    }
  }, [isAdmin, getAllOrders]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setSettings((prev) => ({ ...prev, pushNotifications: granted }));
    if (granted) {
      toast({ title: "Notificações ativadas!" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-foreground" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="secondary">
                  <Package className="h-3 w-3 mr-1" />
                  {orders.length} pedidos
                </Badge>
                <Badge variant="secondary">
                  <Heart className="h-3 w-3 mr-1" />
                  {favorites.length} favoritos
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass border border-border/30 p-1 h-auto flex-wrap">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Dados Pessoais</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="gap-2 text-primary">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Painel Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass border-border/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Gerencie seus dados de cadastro</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" value={formData.email} disabled className="glass" />
                    <p className="text-xs text-muted-foreground">
                      O e-mail não pode ser alterado
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Gerencie suas credenciais de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
                <CardDescription>
                  {orders.length === 0
                    ? "Você ainda não fez nenhum pedido"
                    : `${orders.length} pedido(s) realizados`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                      Começar a Comprar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const status = statusConfig[order.status as keyof typeof statusConfig];
                      const StatusIcon = status?.icon || Package;

                      return (
                        <div
                          key={order.id}
                          onClick={() => navigate("/meus-pedidos")}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                status?.color === "success"
                                  ? "bg-success/10 text-success"
                                  : status?.color === "warning"
                                  ? "bg-warning/10 text-warning"
                                  : status?.color === "destructive"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Pedido #{order.id.slice(-6)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(order.total)}</p>
                              <Badge variant={status?.color === "success" ? "success" : "secondary"}>
                                {status?.label}
                              </Badge>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      );
                    })}

                    {orders.length > 5 && (
                      <Button variant="outline" className="w-full" onClick={() => navigate("/meus-pedidos")}>
                        Ver todos os pedidos
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>Configure como deseja receber atualizações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Notificações push</p>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas em tempo real no navegador
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={handleEnablePush}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">E-mails de atualizações</p>
                    <p className="text-sm text-muted-foreground">
                      Receba e-mails sobre seus pedidos
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Status de pedidos</p>
                    <p className="text-sm text-muted-foreground">
                      Notificações quando seus pedidos forem atualizados
                    </p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, orderUpdates: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Promoções e ofertas</p>
                    <p className="text-sm text-muted-foreground">
                      Receba cupons exclusivos e ofertas especiais
                    </p>
                  </div>
                  <Switch
                    checked={settings.promotions}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, promotions: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30 border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>Ações irreversíveis da conta</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Excluir minha conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab */}
          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Painel Administrativo
                  </h2>
                  <p className="text-muted-foreground">Dashboard de vendas e métricas</p>
                </div>
                <div className="flex gap-2">
                  <ExportReports orders={allOrders} products={products} />
                  <Button variant="outline" onClick={() => navigate("/admin")}>
                    Gerenciar Produtos e Pedidos
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              
              {/* Low Stock Alerts */}
              <LowStockAlert products={products} threshold={10} />
              
              {/* Sales Trend Chart */}
              <SalesTrendChart orders={allOrders} />
              
              {/* Sales Dashboard */}
              <SalesDashboard orders={allOrders} products={products} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;

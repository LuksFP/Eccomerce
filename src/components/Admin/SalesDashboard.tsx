import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatPrice";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Star,
} from "lucide-react";

type SalesDashboardProps = {
  orders: Order[];
  products: Product[];
};

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const SalesDashboard = ({ orders, products }: SalesDashboardProps) => {
  // Calculate metrics
  const metrics = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
    const conversionRate = totalOrders > 0 ? ((totalOrders - cancelledOrders) / totalOrders) * 100 : 0;

    // Monthly revenue data
    const monthlyRevenue: Record<string, number> = {};
    completedOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.total;
    });

    const revenueData = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, value]) => ({
        month: new Date(month + "-01").toLocaleDateString("pt-BR", { month: "short" }),
        value,
      }));

    // Best selling products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = { name: item.product.name, quantity: 0, revenue: 0 };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.priceAtPurchase * item.quantity;
      });
    });

    const bestSelling = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Sales by category
    const categoryRevenue: Record<string, number> = {};
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product.category || "outros";
        categoryRevenue[category] = (categoryRevenue[category] || 0) + item.priceAtPurchase * item.quantity;
      });
    });

    const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({
      name: name === "eletronicos" ? "Eletrônicos" : name === "roupas" ? "Roupas" : name === "acessorios" ? "Acessórios" : name,
      value,
    }));

    // Orders by status
    const statusCount: Record<string, number> = {};
    orders.forEach((order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    const statusLabels: Record<string, string> = {
      pending: "Pendente",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };

    const statusData = Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
    }));

    // Daily orders (last 7 days)
    const dailyOrders: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyOrders[key] = 0;
    }
    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().split("T")[0];
      if (dailyOrders[key] !== undefined) {
        dailyOrders[key]++;
      }
    });

    const dailyData = Object.entries(dailyOrders).map(([date, count]) => ({
      day: new Date(date).toLocaleDateString("pt-BR", { weekday: "short" }),
      orders: count,
    }));

    return {
      totalRevenue,
      totalOrders,
      averageTicket,
      conversionRate,
      revenueData,
      bestSelling,
      categoryData,
      statusData,
      dailyData,
    };
  }, [orders, products]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary font-bold">
            {typeof payload[0].value === "number" && payload[0].value > 100
              ? formatPrice(payload[0].value)
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">{formatPrice(metrics.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-chart-2/10">
                <ShoppingCart className="h-5 w-5 text-chart-2" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">{formatPrice(metrics.averageTicket)}</p>
              </div>
              <div className="p-3 rounded-full bg-chart-3/10">
                <Star className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 mr-1" />
              -2.1% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-full bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.3% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} 
                    className="text-xs" 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos por Dia (Última Semana)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.bestSelling.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma venda registrada
                </p>
              ) : (
                metrics.bestSelling.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-amber-500 text-white" :
                      index === 1 ? "bg-slate-400 text-white" :
                      index === 2 ? "bg-amber-700 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.quantity} unidades
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

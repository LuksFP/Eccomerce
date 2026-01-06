import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { formatPrice } from "@/utils/formatPrice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

type SalesTrendChartProps = {
  orders: Order[];
};

type Period = "week" | "month" | "quarter";

export const SalesTrendChart = ({ orders }: SalesTrendChartProps) => {
  const [period, setPeriod] = useState<Period>("week");

  const trendData = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status !== "cancelled");
    const now = new Date();
    
    if (period === "week") {
      // Last 8 weeks
      const weeklyData: Record<string, { revenue: number; orders: number }> = {};
      
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekKey = `Sem ${8 - i}`;
        weeklyData[weekKey] = { revenue: 0, orders: 0 };
      }

      completedOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const weeksAgo = Math.floor((now.getTime() - orderDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        if (weeksAgo >= 0 && weeksAgo < 8) {
          const weekKey = `Sem ${8 - weeksAgo}`;
          if (weeklyData[weekKey]) {
            weeklyData[weekKey].revenue += order.total;
            weeklyData[weekKey].orders += 1;
          }
        }
      });

      return Object.entries(weeklyData).map(([label, data]) => ({
        label,
        revenue: data.revenue,
        orders: data.orders,
      }));
    } else if (period === "month") {
      // Last 6 months
      const monthlyData: Record<string, { revenue: number; orders: number }> = {};
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short" });
        monthlyData[monthKey] = { revenue: 0, orders: 0 };
      }

      completedOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = orderDate.toLocaleDateString("pt-BR", { month: "short" });
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += order.total;
          monthlyData[monthKey].orders += 1;
        }
      });

      return Object.entries(monthlyData).map(([label, data]) => ({
        label,
        revenue: data.revenue,
        orders: data.orders,
      }));
    } else {
      // Last 4 quarters
      const quarterlyData: Record<string, { revenue: number; orders: number }> = {};
      
      for (let i = 3; i >= 0; i--) {
        const quarterDate = new Date(now);
        quarterDate.setMonth(quarterDate.getMonth() - (i * 3));
        const quarter = Math.floor(quarterDate.getMonth() / 3) + 1;
        const year = quarterDate.getFullYear();
        const quarterKey = `Q${quarter}/${year.toString().slice(-2)}`;
        quarterlyData[quarterKey] = { revenue: 0, orders: 0 };
      }

      completedOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const quarter = Math.floor(orderDate.getMonth() / 3) + 1;
        const year = orderDate.getFullYear();
        const quarterKey = `Q${quarter}/${year.toString().slice(-2)}`;
        
        if (quarterlyData[quarterKey]) {
          quarterlyData[quarterKey].revenue += order.total;
          quarterlyData[quarterKey].orders += 1;
        }
      });

      return Object.entries(quarterlyData).map(([label, data]) => ({
        label,
        revenue: data.revenue,
        orders: data.orders,
      }));
    }
  }, [orders, period]);

  // Calculate trend
  const trend = useMemo(() => {
    if (trendData.length < 2) return 0;
    const current = trendData[trendData.length - 1].revenue;
    const previous = trendData[trendData.length - 2].revenue;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, [trendData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          <p className="text-sm text-primary">
            Receita: <span className="font-bold">{formatPrice(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-muted-foreground">
              Pedidos: <span className="font-medium">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Tendência de Vendas
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : null}
            <span className={`text-sm font-medium ${
              trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
            }`}>
              {trend > 0 ? "+" : ""}{trend.toFixed(1)}% vs período anterior
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant={period === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("week")}
          >
            Semana
          </Button>
          <Button
            variant={period === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("month")}
          >
            Mês
          </Button>
          <Button
            variant={period === "quarter" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("quarter")}
          >
            Trimestre
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                className="text-xs"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

type ExportReportsProps = {
  orders: Order[];
  products: Product[];
};

export const ExportReports = ({ orders, products }: ExportReportsProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const generateSalesData = () => {
    const completedOrders = orders.filter((o) => o.status !== "cancelled");
    
    // Summary data
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Orders data
    const ordersData = orders.map((order) => ({
      "ID do Pedido": order.id.slice(-8),
      "Data": new Date(order.createdAt).toLocaleDateString("pt-BR"),
      "Status": order.status === "pending" ? "Pendente" :
                order.status === "processing" ? "Processando" :
                order.status === "shipped" ? "Enviado" :
                order.status === "delivered" ? "Entregue" : "Cancelado",
      "Subtotal": order.subtotal,
      "Frete": order.shipping,
      "Total": order.total,
      "Método de Pagamento": order.paymentMethod,
      "Itens": order.items.length,
    }));

    // Products data
    const productSales: Record<string, { name: string; category: string; quantity: number; revenue: number }> = {};
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            category: item.product.category || "outros",
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.priceAtPurchase * item.quantity;
      });
    });

    const productsData = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .map((p, index) => ({
        "Posição": index + 1,
        "Produto": p.name,
        "Categoria": p.category,
        "Quantidade Vendida": p.quantity,
        "Receita": p.revenue,
      }));

    // Stock data
    const stockData = products
      .sort((a, b) => a.stock - b.stock)
      .map((p) => ({
        "Produto": p.name,
        "Categoria": p.category,
        "Estoque Atual": p.stock,
        "Preço": p.price,
        "Status": p.stock === 0 ? "Sem Estoque" : p.stock <= 5 ? "Crítico" : p.stock <= 10 ? "Baixo" : "Normal",
      }));

    // Summary sheet
    const summaryData = [
      { "Métrica": "Receita Total", "Valor": formatPrice(totalRevenue) },
      { "Métrica": "Total de Pedidos", "Valor": totalOrders },
      { "Métrica": "Ticket Médio", "Valor": formatPrice(averageTicket) },
      { "Métrica": "Pedidos Entregues", "Valor": orders.filter((o) => o.status === "delivered").length },
      { "Métrica": "Pedidos Cancelados", "Valor": orders.filter((o) => o.status === "cancelled").length },
      { "Métrica": "Produtos com Estoque Baixo", "Valor": products.filter((p) => p.stock <= 10).length },
    ];

    return { ordersData, productsData, stockData, summaryData };
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const { ordersData, productsData, stockData, summaryData } = generateSalesData();

      const workbook = XLSX.utils.book_new();

      // Add sheets
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo");

      const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(workbook, ordersSheet, "Pedidos");

      const productsSheet = XLSX.utils.json_to_sheet(productsData);
      XLSX.utils.book_append_sheet(workbook, productsSheet, "Produtos Vendidos");

      const stockSheet = XLSX.utils.json_to_sheet(stockData);
      XLSX.utils.book_append_sheet(workbook, stockSheet, "Estoque");

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `relatorio-vendas-${date}.xlsx`;

      // Download
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Relatório exportado!",
        description: `Arquivo ${filename} baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const { ordersData } = generateSalesData();

      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.json_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(workbook, sheet, "Pedidos");

      const date = new Date().toISOString().split("T")[0];
      const filename = `pedidos-${date}.csv`;

      XLSX.writeFile(workbook, filename, { bookType: "csv" });

      toast({
        title: "CSV exportado!",
        description: `Arquivo ${filename} baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o CSV.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar Relatório
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-success" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-primary" />
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

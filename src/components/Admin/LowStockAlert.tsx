import { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LowStockAlertProps = {
  products: Product[];
  threshold?: number;
};

export const LowStockAlert = ({ products, threshold = 10 }: LowStockAlertProps) => {
  const navigate = useNavigate();
  
  const lowStockProducts = products
    .filter((p) => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);

  if (lowStockProducts.length === 0) {
    return null;
  }

  const criticalCount = lowStockProducts.filter((p) => p.stock === 0).length;
  const warningCount = lowStockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <Card className="border-warning/50 bg-warning/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertas de Estoque
          <Badge variant="destructive" className="ml-auto">
            {lowStockProducts.length} produto(s)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex gap-4 text-sm">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-destructive font-medium">
                {criticalCount} sem estoque
              </span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-warning font-medium">
                {warningCount} estoque crítico
              </span>
            </div>
          )}
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {lowStockProducts.slice(0, 10).map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <Badge
                variant={product.stock === 0 ? "destructive" : "warning"}
                className="flex-shrink-0"
              >
                <Package className="h-3 w-3 mr-1" />
                {product.stock} un.
              </Badge>
            </div>
          ))}
        </div>

        {lowStockProducts.length > 10 && (
          <p className="text-xs text-muted-foreground text-center">
            +{lowStockProducts.length - 10} outros produtos com estoque baixo
          </p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/admin")}
        >
          Gerenciar Estoque
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

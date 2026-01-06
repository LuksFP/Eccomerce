import { useCompare } from "@/context/CompareContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GitCompareArrows, X, Star, Package, Tag, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { categoryLabels } from "@/types/product";
import { Link } from "react-router-dom";

export const CompareDrawer = () => {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();

  if (compareItems.length === 0) {
    return null;
  }

  const specifications = [
    {
      label: "Imagem",
      render: (product: typeof compareItems[0]) => (
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg mx-auto"
        />
      ),
    },
    {
      label: "Nome",
      render: (product: typeof compareItems[0]) => (
        <Link
          to={`/produto/${product.id}`}
          className="font-medium hover:text-primary transition-colors text-sm"
        >
          {product.name}
        </Link>
      ),
    },
    {
      label: "Preço",
      render: (product: typeof compareItems[0]) => (
        <div className="space-y-1">
          <p className="font-bold text-primary">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Categoria",
      render: (product: typeof compareItems[0]) => (
        <Badge variant="secondary" className="text-xs">
          <Tag className="h-3 w-3 mr-1" />
          {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
        </Badge>
      ),
    },
    {
      label: "Avaliação",
      render: (product: typeof compareItems[0]) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{product.rating?.toFixed(1) || "N/A"}</span>
        </div>
      ),
    },
    {
      label: "Estoque",
      render: (product: typeof compareItems[0]) => (
        <div className="flex items-center justify-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className={product.stock > 0 ? "text-emerald-500" : "text-destructive"}>
            {product.stock > 0 ? `${product.stock} un.` : "Esgotado"}
          </span>
        </div>
      ),
    },
    {
      label: "Descrição",
      render: (product: typeof compareItems[0]) => (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {product.description || "Sem descrição"}
        </p>
      ),
    },
    {
      label: "Ações",
      render: (product: typeof compareItems[0]) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCompare(product.id)}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Sheet open={isCompareOpen} onOpenChange={setIsCompareOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-20 right-4 z-40 gap-2 shadow-lg"
        >
          <GitCompareArrows className="h-4 w-4" />
          Comparar
          <Badge variant="secondary" className="ml-1">
            {compareItems.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5" />
              Comparar Produtos ({compareItems.length})
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-destructive hover:text-destructive gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Especificação</TableHead>
                {compareItems.map((product) => (
                  <TableHead key={product.id} className="text-center min-w-[180px]">
                    {product.name.length > 20
                      ? `${product.name.slice(0, 20)}...`
                      : product.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {specifications.map((spec) => (
                <TableRow key={spec.label}>
                  <TableCell className="font-medium text-muted-foreground">
                    {spec.label}
                  </TableCell>
                  {compareItems.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {spec.render(product)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/context/CompareContext";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CompareButtonProps = {
  product: Product;
  variant?: "icon" | "full";
  className?: string;
};

export const CompareButton = ({ product, variant = "icon", className }: CompareButtonProps) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  if (variant === "full") {
    return (
      <Button
        variant={isComparing ? "secondary" : "outline"}
        size="sm"
        onClick={handleClick}
        className={cn("gap-2", className)}
      >
        <GitCompareArrows className="h-4 w-4" />
        {isComparing ? "Remover" : "Comparar"}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={cn(
              "h-8 w-8 rounded-full",
              isComparing && "bg-primary/20 text-primary",
              className
            )}
          >
            <GitCompareArrows className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isComparing ? "Remover da comparação" : "Adicionar à comparação"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

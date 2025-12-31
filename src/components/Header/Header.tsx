import { Link } from "react-router-dom";
import { CartTrigger } from "@/components/Cart";
import { ShoppingBag } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Loja<span className="text-primary">Elegante</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Início
          </Link>
          <Link
            to="/?category=eletronicos"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Eletrônicos
          </Link>
          <Link
            to="/?category=roupas"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Roupas
          </Link>
          <Link
            to="/?category=acessorios"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Acessórios
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <CartTrigger />
        </div>
      </div>
    </header>
  );
};

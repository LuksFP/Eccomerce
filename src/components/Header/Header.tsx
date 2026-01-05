import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CartTrigger } from "@/components/Cart";
import { NotificationsPopover } from "@/components/Notifications";
import { ThemeToggle } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, User, LogOut, Package, Heart, Shield, Menu, ChevronRight, UserCircle } from "lucide-react";

export const Header = () => {
  const { isAuthenticated, isAdmin, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/?category=eletronicos", label: "Eletrônicos" },
    { to: "/?category=roupas", label: "Roupas" },
    { to: "/?category=acessorios", label: "Acessórios" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 glass border-border/30">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow">
                  <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">
                  Loja<span className="text-gradient">Elegante</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors group"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="my-4 border-t border-border/30" />
                  <Link
                    to="/meus-pedidos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors"
                  >
                    <Package className="h-5 w-5 text-primary" />
                    Meus Pedidos
                  </Link>
                  <Link
                    to="/meus-pedidos?tab=favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors"
                  >
                    <Heart className="h-5 w-5 text-primary" />
                    Favoritos
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-secondary transition-colors"
                    >
                      <Shield className="h-5 w-5" />
                      Painel Admin
                    </Link>
                  )}
                  <div className="my-4 border-t border-border/30" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <div className="my-4 border-t border-border/30" />
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full glow">
                      <User className="h-4 w-4" />
                      Entrar / Cadastrar
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform glow">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground hidden sm:inline">
            Loja<span className="text-gradient">Elegante</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && <NotificationsPopover />}
          <CartTrigger />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                  <User className="h-5 w-5" />
                  {isAdmin && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-border/30">
                <div className="px-3 py-2">
                  <p className="font-medium text-foreground">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="cursor-pointer">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-pedidos" className="cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    Meus Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-pedidos?tab=favorites" className="cursor-pointer">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-border/30" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-primary">
                        <Shield className="h-4 w-4 mr-2" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="hidden sm:flex glow">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
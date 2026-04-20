import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import {
  User, LogOut, Package, Heart, Shield,
  Menu, ChevronRight, UserCircle, Leaf,
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/?category=suplementos", label: "Suplementos" },
  { to: "/?category=fitness", label: "Fitness" },
  { to: "/?category=bem-estar", label: "Bem-estar" },
];

export const Header = () => {
  const { isAuthenticated, isAdmin, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/40 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/10"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-border/30 bg-background/95 backdrop-blur-xl">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">
                  Vital<span className="text-primary">Zone</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors group"
                >
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="my-3 border-t border-border/30" />
                  <Link to="/meus-pedidos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                    <Package className="h-4 w-4 text-primary" /><span>Meus Pedidos</span>
                  </Link>
                  <Link to="/meus-pedidos?tab=favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                    <Heart className="h-4 w-4 text-primary" /><span>Favoritos</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-primary transition-colors">
                      <Shield className="h-4 w-4" /><span>Painel Admin</span>
                    </Link>
                  )}
                  <div className="my-3 border-t border-border/30" />
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
                    <LogOut className="h-4 w-4" /><span>Sair</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <div className="my-3 border-t border-border/30" />
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full glow rounded-xl"><User className="h-4 w-4" />Entrar / Cadastrar</Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow"
          >
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl font-bold text-foreground hidden sm:inline">
            Vital<span className="text-primary">Zone</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname + location.search === link.to ||
              (link.to !== "/" && location.search.includes(link.to.split("?")[1] ?? ""));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {isAuthenticated && <NotificationsPopover />}
          <CartTrigger />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hidden sm:flex rounded-xl">
                  <User className="h-5 w-5" />
                  {isAdmin && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-border/30 rounded-xl">
                <div className="px-3 py-2.5">
                  <p className="font-semibold text-sm text-foreground">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem asChild><Link to="/perfil" className="cursor-pointer"><UserCircle className="h-4 w-4 mr-2" />Meu Perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/meus-pedidos" className="cursor-pointer"><Package className="h-4 w-4 mr-2" />Meus Pedidos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/meus-pedidos?tab=favorites" className="cursor-pointer"><Heart className="h-4 w-4 mr-2" />Favoritos</Link></DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-border/30" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-primary"><Shield className="h-4 w-4 mr-2" />Painel Admin</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="hidden sm:flex glow rounded-xl font-semibold text-xs px-4">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

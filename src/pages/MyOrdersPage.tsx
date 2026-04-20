import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { orderStatusLabels, paymentMethodLabels } from "@/types/order";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Heart, LogOut, ShoppingBag,
  ArrowRight, Trash2, ChevronRight, Star,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pending:    { label: "Pendente",      color: "text-warning bg-warning/10",      dot: "bg-warning" },
  processing: { label: "Processando",   color: "text-primary bg-primary/10",      dot: "bg-primary" },
  shipped:    { label: "Enviado",       color: "text-blue-400 bg-blue-400/10",    dot: "bg-blue-400" },
  delivered:  { label: "Entregue",      color: "text-success bg-success/10",      dot: "bg-success" },
  cancelled:  { label: "Cancelado",     color: "text-destructive bg-destructive/10", dot: "bg-destructive" },
};

const EmptyOrders = ({ onShop }: { onShop: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-20 text-center"
  >
    <div className="relative inline-flex mb-6">
      <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border/20 flex items-center justify-center">
        <Package className="h-9 w-9 text-muted-foreground/50" />
      </div>
      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">0</span>
    </div>
    <h3 className="font-display font-bold text-xl text-foreground mb-2">Nenhum pedido ainda</h3>
    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
      Sua jornada na VitalZone está apenas começando. Explore nossos produtos e faça seu primeiro pedido.
    </p>
    <Button onClick={onShop} className="glow rounded-full px-8 font-bold gap-2">
      Explorar Produtos <ArrowRight className="h-4 w-4" />
    </Button>
  </motion.div>
);

const EmptyFavorites = ({ onShop }: { onShop: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-20 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border/20 flex items-center justify-center mx-auto mb-6">
      <Heart className="h-9 w-9 text-muted-foreground/50" />
    </div>
    <h3 className="font-display font-bold text-xl text-foreground mb-2">Sem favoritos</h3>
    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
      Salve produtos que você gosta para encontrá-los facilmente depois.
    </p>
    <Button onClick={onShop} className="glow rounded-full px-8 font-bold gap-2">
      Ver Produtos <ArrowRight className="h-4 w-4" />
    </Button>
  </motion.div>
);

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "favorites" ? "favorites" : "orders";
  const [activeTab, setActiveTab] = useState<"orders" | "favorites">(defaultTab as "orders" | "favorites");

  const { profile, isAuthenticated, logout } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const { favorites, removeFavorite } = useFavorites();
  const { getProductById } = useProducts();
  const { addItem } = useCart();

  const favoriteProducts = favorites
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (!isAuthenticated) {
    navigate("/auth", { replace: true });
    return null;
  }

  const handleLogout = () => { logout(); navigate("/"); };

  const tabs = [
    { id: "orders" as const, label: "Meus Pedidos", icon: Package, count: orders.length },
    { id: "favorites" as const, label: "Favoritos", icon: Heart, count: favoriteProducts.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8 sm:py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Profile card */}
            <div className="rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/20">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-foreground truncate">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  { label: "Pedidos realizados", value: orders.length, icon: Package },
                  { label: "Produtos favoritos", value: favoriteProducts.length, icon: Heart },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-secondary/30 border border-border/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <span className="font-bold text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 mb-3">Navegação</p>
              {[
                { label: "Perfil", to: "/perfil" },
                { label: "Rastrear Pedido", to: "/rastrear-pedido" },
                { label: "FAQ", to: "/faq" },
                { label: "Voltar à Loja", to: "/" },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors group"
                >
                  {label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div>
            {/* Tab switcher */}
            <div className="flex bg-secondary/40 rounded-xl p-1 border border-border/20 mb-8 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {orders.length === 0 ? (
                    <EmptyOrders onShop={() => navigate("/")} />
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, i) => {
                        const st = statusConfig[order.status] ?? statusConfig.pending;
                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden"
                          >
                            {/* Order header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border/10">
                              <div className="flex items-center gap-3">
                                <span className="font-display font-bold text-sm text-foreground">
                                  #{order.id.slice(-6).toUpperCase()}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${st.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                  {st.label}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                              </span>
                            </div>

                            {/* Product thumbs */}
                            <div className="px-5 py-4">
                              <div className="flex gap-2 mb-4 flex-wrap">
                                {order.items.slice(0, 5).map((item, j) => (
                                  <div key={j} className="relative">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-14 h-14 rounded-xl object-cover border border-border/20"
                                    />
                                    {item.quantity > 1 && (
                                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                                        {item.quantity}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {order.items.length > 5 && (
                                  <div className="w-14 h-14 rounded-xl bg-muted/40 border border-border/20 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    +{order.items.length - 5}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {order.items.reduce((s, i) => s + i.quantity, 0)} itens · {paymentMethodLabels[order.paymentMethod]}
                                  </p>
                                  <p className="font-display font-black text-lg text-foreground">{formatPrice(order.total)}</p>
                                </div>
                                {order.status === "pending" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelOrder(order.id)}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl text-xs"
                                  >
                                    Cancelar pedido
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "favorites" && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {favoriteProducts.length === 0 ? (
                    <EmptyFavorites onShop={() => navigate("/")} />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteProducts.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="group rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm overflow-hidden flex gap-0"
                        >
                          <Link to={`/produto/${product.id}`} className="relative w-28 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 min-h-[120px]"
                            />
                          </Link>
                          <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                            <div>
                              <Link to={`/produto/${product.id}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 mb-1 block">
                                {product.name}
                              </Link>
                              {product.rating && (
                                <div className="flex items-center gap-1 mb-2">
                                  <Star className="h-3 w-3 fill-warning text-warning" />
                                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                                </div>
                              )}
                              <p className="font-display font-black text-base text-primary">{formatPrice(product.price)}</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                className="flex-1 rounded-xl text-xs font-bold h-8"
                                onClick={() => addItem(product)}
                                disabled={product.stock === 0}
                              >
                                {product.stock === 0 ? "Esgotado" : "Comprar"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFavorite(product.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrdersPage;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { CompareProvider } from "@/context/CompareContext";
import { ChatbotWidget } from "@/components/Chatbot";
import { CompareDrawer } from "@/components/Compare";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <ReviewsProvider>
                  <NotificationsProvider>
                    <CompareProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/produto/:id" element={<ProductDetails />} />
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/meus-pedidos" element={<MyOrdersPage />} />
                          <Route path="/pedido/:orderId" element={<OrderTrackingPage />} />
                          <Route path="/perfil" element={<ProfilePage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/wishlist/:shareCode" element={<WishlistPage />} />
                          <Route path="/faq" element={<FAQPage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <ChatbotWidget />
                        <CompareDrawer />
                      </BrowserRouter>
                    </CompareProvider>
                  </NotificationsProvider>
                </ReviewsProvider>
              </OrdersProvider>
            </FavoritesProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Order, OrderItem, ShippingAddress, PaymentMethod } from "@/types/order";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { toast } from "@/hooks/use-toast";

type OrdersContextType = {
  orders: Order[];
  createOrder: (address: ShippingAddress, paymentMethod: PaymentMethod) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
  // Admin functions
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "ecommerce-orders";

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { items, clearCart, totalPrice } = useCart();
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Load all orders on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const orders = parsed.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
        }));
        setAllOrders(orders);
      }
    } catch {
      setAllOrders([]);
    }
  }, []);

  // Save orders when they change
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
  }, [allOrders]);

  // Get orders for current user
  const orders = user
    ? allOrders.filter((o) => o.userId === user.id)
    : [];

  const createOrder = useCallback(
    (address: ShippingAddress, paymentMethod: PaymentMethod): Order | null => {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para fazer um pedido.",
          variant: "destructive",
        });
        return null;
      }

      if (items.length === 0) {
        toast({
          title: "Carrinho vazio",
          description: "Adicione produtos ao carrinho antes de finalizar.",
          variant: "destructive",
        });
        return null;
      }

      const orderItems: OrderItem[] = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      const shipping = 0; // Free shipping
      const subtotal = totalPrice;

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        status: "pending",
        subtotal,
        shipping,
        total: subtotal + shipping,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setAllOrders((prev) => [newOrder, ...prev]);
      clearCart();

      toast({
        title: "Pedido realizado!",
        description: `Pedido #${newOrder.id.slice(-6)} criado com sucesso.`,
      });

      return newOrder;
    },
    [user, items, totalPrice, clearCart]
  );

  const getOrderById = useCallback(
    (orderId: string) => allOrders.find((o) => o.id === orderId),
    [allOrders]
  );

  const cancelOrder = useCallback(
    (orderId: string) => {
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "cancelled" as const, updatedAt: new Date() }
            : o
        )
      );
      toast({
        title: "Pedido cancelado",
      });
    },
    []
  );

  const getAllOrders = useCallback(() => {
    if (!isAdmin) return [];
    return allOrders;
  }, [isAdmin, allOrders]);

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      if (!isAdmin) return;
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
        )
      );
      toast({
        title: "Status atualizado",
      });
    },
    [isAdmin]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        cancelOrder,
        getAllOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

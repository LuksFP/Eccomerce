import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { toast } from "@/hooks/use-toast";
import { Order, ShippingAddress, PaymentMethod, OrderStatus } from "@/types/order";

type CouponValidation = {
  isValid: boolean;
  discount: number;
  message: string;
  code?: string;
};

type OrdersContextType = {
  orders: Order[];
  isLoading: boolean;
  createOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    couponCode?: string,
    discount?: number
  ) => Promise<Order | null>;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => Promise<void>;
  getAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  validateCoupon: (code: string, subtotal: number) => Promise<CouponValidation>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(o => ({
        id: o.id,
        userId: o.user_id || "",
        items: o.items as Order["items"],
        shippingAddress: o.shipping_address as ShippingAddress,
        paymentMethod: o.payment_method as PaymentMethod,
        status: o.status as OrderStatus,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        total: Number(o.total),
        createdAt: new Date(o.created_at),
        updatedAt: new Date(o.updated_at),
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated, fetchOrders]);

  const validateCoupon = useCallback(async (code: string, subtotal: number): Promise<CouponValidation> => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return { isValid: false, discount: 0, message: "Cupom inválido ou expirado" };
    }

    // Check minimum purchase
    if (data.min_purchase && subtotal < Number(data.min_purchase)) {
      return {
        isValid: false,
        discount: 0,
        message: `Compra mínima de R$ ${Number(data.min_purchase).toFixed(2)} para este cupom`,
      };
    }

    // Check max uses
    if (data.max_uses && data.used_count >= data.max_uses) {
      return { isValid: false, discount: 0, message: "Cupom esgotado" };
    }

    // Check validity dates
    const now = new Date();
    if (data.valid_until && new Date(data.valid_until) < now) {
      return { isValid: false, discount: 0, message: "Cupom expirado" };
    }

    // Calculate discount
    let discount = 0;
    if (data.discount_type === "percentage") {
      discount = subtotal * (Number(data.discount_value) / 100);
    } else {
      discount = Number(data.discount_value);
    }

    return {
      isValid: true,
      discount,
      message: data.description || `Desconto de ${data.discount_type === "percentage" ? `${data.discount_value}%` : `R$ ${Number(data.discount_value).toFixed(2)}`}`,
      code: data.code,
    };
  }, []);

  const createOrder = useCallback(async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    couponCode?: string,
    discount: number = 0
  ): Promise<Order | null> => {
    if (!user || items.length === 0) return null;

    const shipping = paymentMethod === "pix" ? 0 : 25;
    const subtotal = totalPrice;
    const total = Math.max(0, subtotal + shipping - discount);

    const orderItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items: orderItems,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        subtotal,
        shipping,
        discount,
        coupon_code: couponCode || null,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Erro ao criar pedido", variant: "destructive" });
      return null;
    }

    clearCart();
    fetchOrders();

    const newOrder: Order = {
      id: data.id,
      userId: data.user_id || "",
      items: data.items as Order["items"],
      shippingAddress: data.shipping_address as ShippingAddress,
      paymentMethod: data.payment_method as PaymentMethod,
      status: data.status as OrderStatus,
      subtotal: Number(data.subtotal),
      shipping: Number(data.shipping),
      total: Number(data.total),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    toast({ title: "Pedido criado com sucesso!" });
    return newOrder;
  }, [user, items, totalPrice, clearCart, fetchOrders]);

  const getOrderById = useCallback(
    (id: string) => orders.find(o => o.id === id),
    [orders]
  );

  const cancelOrder = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) {
      toast({ title: "Pedido cancelado" });
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const getAllOrders = useCallback(async (): Promise<Order[]> => {
    if (!isAdmin) return [];

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map(o => ({
      id: o.id,
      userId: o.user_id || "",
      items: o.items as Order["items"],
      shippingAddress: o.shipping_address as ShippingAddress,
      paymentMethod: o.payment_method as PaymentMethod,
      status: o.status as OrderStatus,
      subtotal: Number(o.subtotal),
      shipping: Number(o.shipping),
      total: Number(o.total),
      createdAt: new Date(o.created_at),
      updatedAt: new Date(o.updated_at),
    }));
  }, [isAdmin]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    if (!isAdmin) return;

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      toast({ title: "Status do pedido atualizado" });
    }
  }, [isAdmin]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        getOrderById,
        cancelOrder,
        getAllOrders,
        updateOrderStatus,
        validateCoupon,
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

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";

const statusMessages: Record<string, { title: string; message: string }> = {
  pending: {
    title: "Pedido Recebido 📦",
    message: "Seu pedido foi recebido e está aguardando processamento.",
  },
  processing: {
    title: "Pedido em Processamento 🔄",
    message: "Seu pedido está sendo preparado para envio.",
  },
  shipped: {
    title: "Pedido Enviado 🚚",
    message: "Seu pedido foi enviado! Em breve chegará no endereço informado.",
  },
  delivered: {
    title: "Pedido Entregue ✅",
    message: "Seu pedido foi entregue com sucesso. Aproveite!",
  },
  cancelled: {
    title: "Pedido Cancelado ❌",
    message: "Seu pedido foi cancelado.",
  },
};

export const useOrderNotifications = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status as string;
          const orderId = payload.new.id as string;
          const shortId = orderId.slice(0, 8).toUpperCase();

          const statusInfo = statusMessages[newStatus];
          if (statusInfo) {
            addNotification({
              type: "order",
              title: statusInfo.title,
              message: `Pedido #${shortId}: ${statusInfo.message}`,
              link: "/meus-pedidos",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, addNotification]);
};

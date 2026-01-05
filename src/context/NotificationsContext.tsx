import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

export type NotificationType = "promotion" | "order" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  requestPushPermission: () => Promise<boolean>;
  pushEnabled: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = "app_notifications";

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Add welcome notification for new users
        const welcomeNotification: Notification = {
          id: crypto.randomUUID(),
          type: "system",
          title: "Bem-vindo! 🎉",
          message: "Obrigado por se cadastrar! Explore nossa loja e aproveite ofertas exclusivas.",
          read: false,
          createdAt: new Date().toISOString(),
          link: "/",
        };
        setNotifications([welcomeNotification]);
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Check push permission status
  useEffect(() => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications

    // Show browser notification if enabled
    if (pushEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      });
    }
  }, [pushEnabled]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`${STORAGE_KEY}_${user.id}`);
    }
  }, [user]);

  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      setPushEnabled(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setPushEnabled(granted);
      return granted;
    }

    return false;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPushPermission,
        pushEnabled,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
};

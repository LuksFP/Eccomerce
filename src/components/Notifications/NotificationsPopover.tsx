import { useNavigate } from "react-router-dom";
import { useNotifications, NotificationType } from "@/context/NotificationsContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, BellRing, Package, Tag, Info, Check, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: NotificationType) => {
  const iconClasses = "h-4 w-4";
  switch (type) {
    case "promotion":
      return (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Tag className={cn(iconClasses, "text-primary")} />
        </div>
      );
    case "order":
      return (
        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
          <Package className={cn(iconClasses, "text-success")} />
        </div>
      );
    case "system":
      return (
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Info className={cn(iconClasses, "text-muted-foreground")} />
        </div>
      );
  }
};

const formatRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return past.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
};

export const NotificationsPopover = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover-glow"
          aria-label="Notificações"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 glass border-border/30" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="font-display font-bold">Notificações</h3>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={markAllAsRead}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar lidas
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma notificação ainda
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-secondary/50 relative group",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.link)
                  }
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !notification.read && "text-foreground",
                            notification.read && "text-muted-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: "proposal" | "message" | "status" | "user";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationBell = ({
  notifications,
  onClearAll,
  onMarkAsRead,
}: NotificationBellProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "proposal":
        return "💰";
      case "message":
        return "💬";
      case "status":
        return "📦";
      case "user":
        return "👤";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="font-semibold">Notificações</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1"
              onClick={onClearAll}
            >
              Limpar todas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                  !notification.read ? "bg-accent/50" : ""
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span>{getIcon(notification.type)}</span>
                  <span className="font-medium flex-1 truncate">
                    {notification.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                  {notification.description}
                </p>
                <span className="text-xs text-muted-foreground pl-6">
                  {formatDistanceToNow(notification.timestamp, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";

import React, { createContext, useContext, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";

interface NotificationsContextType {
  unreadMessages: Set<string>;
  markAsRead: (conversationId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  unreadMessages: new Set(),
  markAsRead: () => {},
});

export const useNotifications = () => {
  return useContext(NotificationsContext);
};

export function NotificationsProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [unreadMessages, setUnreadMessages] = React.useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.senderId !== userId) {
        // Show notification
        toast(`New message from ${message.sender.name}`, {
          description: message.content,
          action: {
            label: "View",
            onClick: () => window.location.href = `/chat/${message.chatId}`,
          },
        });

        // Add to unread messages
        setUnreadMessages((prev) => new Set(prev).add(message.chatId));

        // Play notification sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch(console.error);
      }
    };

    // Subscribe to all user's conversations
    pusherClient.subscribe(`user-${userId}`);
    pusherClient.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unbind("new-message", handleNewMessage);
    };
  }, [userId]);

  const markAsRead = (conversationId: string) => {
    setUnreadMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(conversationId);
      return newSet;
    });
  };

  return (
    <NotificationsContext.Provider value={{ unreadMessages, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

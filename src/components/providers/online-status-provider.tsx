"use client";

import React, { createContext, useContext, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

interface OnlineStatusContextType {
  onlineUsers: Set<string>;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  onlineUsers: new Set(),
});

export const useOnlineStatus = () => {
  return useContext(OnlineStatusContext);
};

export function OnlineStatusProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [onlineUsers, setOnlineUsers] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    // Subscribe to presence channel
    const channel = pusherClient.subscribe("presence-online");

    // Handle user online status
    const handleUserOnline = (userId: string) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    // Handle user offline status
    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    // Set current user as online
    fetch("/api/presence", {
      method: "POST",
    });

    channel.bind("user-online", handleUserOnline);
    channel.bind("user-offline", handleUserOffline);

    // Cleanup
    return () => {
      channel.unbind("user-online", handleUserOnline);
      channel.unbind("user-offline", handleUserOffline);
      pusherClient.unsubscribe("presence-online");

      // Set user as offline
      fetch("/api/presence", {
        method: "DELETE",
      });
    };
  }, [userId]);

  return (
    <OnlineStatusContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

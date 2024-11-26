"use client";

import { useOnlineStatus } from "@/components/providers/online-status-provider";
import { cn } from "@/lib/utils";

interface OnlineBadgeProps {
  userId: string;
  className?: string;
}

export default function OnlineBadge({ userId, className }: OnlineBadgeProps) {
  const { onlineUsers } = useOnlineStatus();
  const isOnline = onlineUsers.has(userId);

  if (!isOnline) return null;

  return (
    <span
      className={cn(
        "relative flex h-3 w-3",
        className
      )}
    >
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
  );
}

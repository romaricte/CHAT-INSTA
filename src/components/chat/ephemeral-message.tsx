"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EphemeralMessageProps {
  messageId: string;
  duration: number; // in seconds
  onExpire: () => void;
  children: React.ReactNode;
}

export function EphemeralMessage({
  messageId,
  duration,
  onExpire,
  children,
}: EphemeralMessageProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      if (!isHovered) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isHovered, onExpire]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <div
        className={cn(
          "transition-opacity duration-300",
          timeLeft < 10 && "opacity-50"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface EphemeralToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function EphemeralToggle({
  enabled,
  onToggle,
  className,
}: EphemeralToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "text-gray-500 hover:text-gray-900",
        enabled && "text-blue-500 hover:text-blue-600",
        className
      )}
      onClick={onToggle}
    >
      <Clock className="h-4 w-4 mr-2" />
      {enabled ? "Ephemeral On" : "Ephemeral Off"}
    </Button>
  );
}

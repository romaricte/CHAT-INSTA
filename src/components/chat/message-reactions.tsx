"use client";

import { useState } from "react";
import { EmojiPicker } from "@/components/chat/emoji-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageReactionsProps {
  messageId: string;
  reactions: {
    emoji: string;
    users: { id: string; name: string }[];
  }[];
  currentUserId: string;
  onReact: (emoji: string) => void;
}

export function MessageReactions({
  messageId,
  reactions,
  currentUserId,
  onReact,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReact = async (emoji: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error("Failed to react to message");

      onReact(emoji);
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to add reaction");
    }
  };

  const handleRemoveReaction = async (emoji: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions/${emoji}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove reaction");

      onReact(emoji);
    } catch (error) {
      toast.error("Failed to remove reaction");
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1">
        {reactions.map(({ emoji, users }) => {
          const hasReacted = users.some((user) => user.id === currentUserId);
          return (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className={cn(
                "px-2 py-1 hover:bg-gray-100",
                hasReacted && "bg-gray-100"
              )}
              onClick={() =>
                hasReacted ? handleRemoveReaction(emoji) : handleReact(emoji)
              }
            >
              <span className="mr-1">{emoji}</span>
              <span className="text-xs">{users.length}</span>
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1"
          onClick={() => setShowPicker(!showPicker)}
        >
          +
        </Button>
      </div>
      {showPicker && (
        <div className="absolute bottom-full mb-2">
          <EmojiPicker onSelect={handleReact} />
        </div>
      )}
    </div>
  );
}

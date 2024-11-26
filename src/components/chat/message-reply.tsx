"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageReplyProps {
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      image?: string;
    };
  };
  onCancelReply: () => void;
}

export function MessageReply({ replyTo, onCancelReply }: MessageReplyProps) {
  if (!replyTo) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-2">
      <MessageCircle className="h-4 w-4 text-gray-500" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={replyTo.sender.image} />
            <AvatarFallback>
              {replyTo.sender.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{replyTo.sender.name}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-1">{replyTo.content}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={onCancelReply}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ReplyButtonProps {
  messageId: string;
  onReply: () => void;
  className?: string;
}

export function ReplyButton({
  messageId,
  onReply,
  className,
}: ReplyButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("text-gray-500 hover:text-gray-900", className)}
      onClick={onReply}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Reply
    </Button>
  );
}

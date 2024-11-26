"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { Message, User } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

interface ChatMessagesProps {
  initialMessages: (Message & {
    sender: User;
  })[];
  sessionId: string;
  chatId: string;
  companion: User;
  currentUser: User;
}

type MessageWithUser = Message & {
  sender: User;
};

export default function ChatMessages({
  initialMessages,
  sessionId,
  chatId,
  companion,
  currentUser,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<MessageWithUser[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(chatId);
    scrollToBottom();

    const messageHandler = (message: MessageWithUser) => {
      setMessages((current) => [...current, message]);
      scrollToBottom();
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={cn(
              "flex items-end gap-2",
              message.senderId === currentUser.id && "justify-end"
            )}
          >
            <div
              className={cn(
                "rounded-lg p-4 max-w-[70%]",
                message.senderId === currentUser.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(message.createdAt), "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}

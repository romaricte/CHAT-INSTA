"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { Message, User } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

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
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    pusherClient.subscribe(chatId);
    scrollToBottom();

    const messageHandler = (message: MessageWithUser) => {
      setMessages((current) => [...current, message]);
      setHasNewMessage(true);
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
    setHasNewMessage(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 relative">
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((message, i) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-end gap-2 mb-4",
                message.senderId === currentUser.id && "justify-end"
              )}
            >
              {message.senderId !== currentUser.id && (
                <div className="flex-shrink-0">
                  <Image
                    src={companion.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(companion.name || "User")}
                    alt={companion.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl p-4 max-w-[70%] relative group",
                  message.senderId === currentUser.id
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs opacity-70">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                  {message.senderId === currentUser.id && (
                    <span className="text-xs opacity-70">
                      <CheckCheck className="h-3 w-3 inline" />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
      {hasNewMessage && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          ↓
        </button>
      )}
    </div>
  );
}

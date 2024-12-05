"use client";

import { useEffect, useState } from "react";
import { Message, User } from "@prisma/client";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

type MessageWithSender = Message & {
  sender: User;
};

export default function ChatPage({ params }: ChatPageProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companion, setCompanion] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [chats, setChats] = useState<Array<{
    id: string;
    user: User;
    lastMessage?: string;
    timestamp?: Date;
    unreadCount?: number;
  }>>([]);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          chatId: params.chatId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();
      setMessages((current) => [...current, newMessage]);
      
      // Mettre à jour le dernier message dans la liste des chats
      setChats(current =>
        current.map(chat =>
          chat.id === params.chatId
            ? { ...chat, lastMessage: content, timestamp: new Date() }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, currentUserRes, companionRes, chatsRes] = await Promise.all([
          fetch(`/api/messages/${params.chatId}`),
          fetch("/api/me"),
          fetch(`/api/users/${params.chatId}/companion`),
          fetch("/api/chats"), // Vous devrez créer cet endpoint
        ]);

        if (messagesRes.ok && currentUserRes.ok && companionRes.ok && chatsRes.ok) {
          const [messages, currentUser, companion, chats] = await Promise.all([
            messagesRes.json(),
            currentUserRes.json(),
            companionRes.json(),
            chatsRes.json(),
          ]);

          setMessages(messages);
          setCurrentUser(currentUser);
          setCompanion(companion);
          setChats(chats);
          setIsOnline(Math.random() > 0.5);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.chatId]);

  if (!currentUser || !companion) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Chargement de la conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 h-full flex-shrink-0">
        <ChatSidebar chats={chats} currentChatId={params.chatId} />
      </div>

      {/* Chat principal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col h-full bg-background"
      >
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={companion.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(companion.name || "User")}
                  alt={companion.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">{companion.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {isOnline ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <ChatMessages
          initialMessages={messages}
          sessionId={currentUser.id}
          chatId={params.chatId}
          companion={companion}
          currentUser={currentUser}
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}

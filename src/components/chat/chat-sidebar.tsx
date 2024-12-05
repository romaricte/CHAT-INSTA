"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

interface ChatSidebarProps {
  chats: {
    id: string;
    user: User;
    lastMessage?: string;
    timestamp?: Date;
    unreadCount?: number;
  }[];
  currentChatId?: string;
}

export default function ChatSidebar({ chats, currentChatId }: ChatSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col border-r bg-background">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={false}
            animate={{ backgroundColor: currentChatId === chat.id ? "hsl(var(--muted))" : "transparent" }}
            whileHover={{ backgroundColor: "hsl(var(--muted))" }}
            className={cn(
              "p-4 cursor-pointer border-b transition-colors",
              currentChatId === chat.id && "bg-muted"
            )}
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={chat.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.user.name)}`}
                  alt={chat.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {chat.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{chat.user.name}</h3>
                  {chat.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
              {chat.unreadCount ? (
                <div className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {chat.unreadCount}
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

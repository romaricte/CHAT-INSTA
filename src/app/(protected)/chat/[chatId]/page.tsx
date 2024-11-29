"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Message, User } from "@prisma/client";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

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
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial messages and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, currentUserRes, companionRes] = await Promise.all([
          fetch(`/api/messages/${params.chatId}`),
          fetch("/api/me"),
          fetch(`/api/users/${params.chatId}/companion`),
        ]);

        if (messagesRes.ok && currentUserRes.ok && companionRes.ok) {
          const [messages, currentUser, companion] = await Promise.all([
            messagesRes.json(),
            currentUserRes.json(),
            companionRes.json(),
          ]);

          setMessages(messages);
          setCurrentUser(currentUser);
          setCompanion(companion);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.chatId]);

  if (!currentUser || !companion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{companion.name}</h2>
      </div>
      <ChatMessages
        initialMessages={messages}
        sessionId={currentUser.id}
        chatId={params.chatId}
        companion={companion}
        currentUser={currentUser}
      />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

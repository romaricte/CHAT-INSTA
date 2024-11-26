"use client";

import { User, Conversation, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ConversationWithUsersAndMessages = Conversation & {
  users: User[];
  messages: Message[];
};

interface ConversationListProps {
  conversations: ConversationWithUsersAndMessages[];
  currentUserId: string;
}

export default function ConversationList({
  conversations,
  currentUserId,
}: ConversationListProps) {
  const router = useRouter();

  const getOtherUser = (conversation: ConversationWithUsersAndMessages) => {
    return conversation.users.find((user) => user.id !== currentUserId);
  };

  const getLastMessage = (conversation: ConversationWithUsersAndMessages) => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUser = getOtherUser(conversation);
        const lastMessage = getLastMessage(conversation);

        if (!otherUser) return null;

        return (
          <button
            key={conversation.id}
            onClick={() => router.push(`/chat/${conversation.id}`)}
            className={cn(
              "w-full p-4 rounded-lg hover:bg-accent transition",
              "flex items-start space-x-4 text-left"
            )}
          >
            <div className="flex-1 space-y-1">
              <p className="font-medium">{otherUser.name}</p>
              {lastMessage && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {lastMessage.content}
                </p>
              )}
            </div>
            {lastMessage && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(lastMessage.createdAt), "HH:mm")}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

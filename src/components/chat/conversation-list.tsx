"use client";

import { User, Conversation, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ParticipantWithUser = {
  user: User;
  id: string;
  role: string;
  conversationId: string;
  userId: string;
  joinedAt: Date;
};

type ConversationWithParticipantsAndMessages = Conversation & {
  participants: ParticipantWithUser[];
  messages: Message[];
};

interface ConversationListProps {
  conversations: ConversationWithParticipantsAndMessages[];
  currentUserId: string;
}

export default function ConversationList({
  conversations,
  currentUserId,
}: ConversationListProps) {
  const router = useRouter();

  const getOtherUser = (conversation: ConversationWithParticipantsAndMessages) => {
    return conversation.participants.find((participant) => participant.user.id !== currentUserId)?.user;
  };

  const getLastMessage = (conversation: ConversationWithParticipantsAndMessages) => {
    const messages = conversation.messages || [];
    return messages[0]; // Le premier message est le plus récent car on a utilisé orderBy desc
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <p>Aucune conversation</p>
        <p className="text-sm">Commencez une nouvelle conversation pour chatter avec quelqu'un</p>
      </div>
    );
  }

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
              "flex items-center space-x-4 text-left"
            )}
          >
            <div className="relative">
              <Image
                src={otherUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}`}
                alt={otherUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-medium truncate">{otherUser.name}</p>
                {lastMessage && (
                  <p className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(lastMessage.createdAt), "HH:mm")}
                  </p>
                )}
              </div>
              {lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

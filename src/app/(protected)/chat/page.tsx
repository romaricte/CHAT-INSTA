import { auth } from "@/auth";
import { db } from "@/lib/db";
import ConversationList from "@/components/chat/conversation-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button asChild>
          <Link href="/chat/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Link>
        </Button>
      </div>
      <ConversationList
        conversations={conversations}
        currentUserId={session.user.id}
      />
    </div>
  );
}

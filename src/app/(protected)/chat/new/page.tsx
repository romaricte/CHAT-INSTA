import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NewChatForm from "@/components/chat/new-chat-form";

export default async function NewChatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: session.user.id,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">New Chat</h1>
      <NewChatForm users={users} currentUserId={session.user.id} />
    </div>
  );
}

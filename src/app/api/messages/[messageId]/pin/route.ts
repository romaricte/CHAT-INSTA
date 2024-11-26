import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await auth();
    const { messageId } = params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!message) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Check if user is part of the conversation
    const isUserInConversation = message.conversation.users.some(
      (user) => user.id === session.user.id
    );

    if (!isUserInConversation) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pinnedMessage = await db.pinnedMessage.create({
      data: {
        messageId,
        conversationId: message.conversationId,
        pinnedById: session.user.id,
      },
      include: {
        message: {
          include: {
            sender: true,
          },
        },
      },
    });

    // Notify all users in the conversation
    message.conversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "message-pinned", {
          pinnedMessage,
          conversationId: message.conversationId,
        });
      }
    });

    return NextResponse.json(pinnedMessage);
  } catch (error) {
    console.log("[MESSAGE_PIN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

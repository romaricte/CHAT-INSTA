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
    const body = await req.json();
    const { targetChatId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!targetChatId) {
      return new NextResponse("Target chat ID is required", { status: 400 });
    }

    // Get original message
    const originalMessage = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
      },
    });

    if (!originalMessage) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Check if user is part of target conversation
    const targetConversation = await db.conversation.findFirst({
      where: {
        id: targetChatId,
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        users: true,
      },
    });

    if (!targetConversation) {
      return new NextResponse("Target conversation not found", { status: 404 });
    }

    // Create forwarded message
    const forwardedMessage = await db.message.create({
      data: {
        content: originalMessage.content,
        conversationId: targetChatId,
        senderId: session.user.id,
        forwardedFromId: messageId,
      },
      include: {
        sender: true,
        forwardedFrom: {
          include: {
            sender: true,
          },
        },
      },
    });

    // Notify all users in the target conversation
    targetConversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "new-message", forwardedMessage);
      }
    });

    return NextResponse.json(forwardedMessage);
  } catch (error) {
    console.log("[MESSAGE_FORWARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

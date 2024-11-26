import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(
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
        senderId: session.user.id,
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

    await db.message.delete({
      where: {
        id: messageId,
      },
    });

    // Notify all users in the conversation
    message.conversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "message-deleted", {
          messageId,
          conversationId: message.conversationId,
        });
      }
    });

    return new NextResponse("OK");
  } catch (error) {
    console.log("[MESSAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await auth();
    const { messageId } = params;
    const body = await req.json();
    const { content } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const message = await db.message.findUnique({
      where: {
        id: messageId,
        senderId: session.user.id,
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

    const updatedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
        edited: true,
      },
      include: {
        sender: true,
      },
    });

    // Notify all users in the conversation
    message.conversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "message-updated", updatedMessage);
      }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.log("[MESSAGE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

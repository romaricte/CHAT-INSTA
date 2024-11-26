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
    const { emoji } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!emoji) {
      return new NextResponse("Emoji is required", { status: 400 });
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
        reactions: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (reaction) =>
        reaction.userId === session.user.id && reaction.emoji === emoji
    );

    if (existingReaction) {
      return new NextResponse("Reaction already exists", { status: 400 });
    }

    const reaction = await db.messageReaction.create({
      data: {
        emoji,
        messageId,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    // Notify all users in the conversation
    message.conversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "message-reaction-added", {
          messageId,
          reaction,
        });
      }
    });

    return NextResponse.json(reaction);
  } catch (error) {
    console.log("[REACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string; emoji: string } }
) {
  try {
    const session = await auth();
    const { messageId, emoji } = params;

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

    const reaction = await db.messageReaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: session.user.id,
          emoji,
        },
      },
    });

    // Notify all users in the conversation
    message.conversation.users.forEach((user) => {
      if (user.id !== session.user.id) {
        pusherServer.trigger(`user-${user.id}`, "message-reaction-removed", {
          messageId,
          emoji,
          userId: session.user.id,
        });
      }
    });

    return new NextResponse("OK");
  } catch (error) {
    console.log("[REACTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

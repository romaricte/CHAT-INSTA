import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const messages = await db.message.findMany({
      where: {
        conversationId: params.conversationId,
      },
      include: {
        sender: true,
        seenBy: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();
    const { content, image } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: params.conversationId,
        participants: {
          some: {
            userId: session.user.id
          }
        }
      }
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const message = await db.message.create({
      data: {
        content,
        image,
        conversationId: params.conversationId,
        senderId: session.user.id,
        seenBy: {
          create: {
            userId: session.user.id
          }
        }
      },
      include: {
        sender: true,
        seenBy: true
      }
    });

    // Mettre à jour lastMessageAt de la conversation
    await db.conversation.update({
      where: {
        id: params.conversationId
      },
      data: {
        lastMessageAt: new Date()
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

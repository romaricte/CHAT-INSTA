import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Récupérer tous les chats de l'utilisateur avec leur dernier message
    const chats = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: currentUser.id,
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

    // Formater les données pour le frontend
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => participant.user.id !== currentUser.id
      );
      const lastMessage = chat.messages[0];

      if (!otherParticipant) return null;

      return {
        id: chat.id,
        user: otherParticipant.user,
        lastMessage: lastMessage?.content,
        timestamp: lastMessage?.createdAt || chat.lastMessageAt,
        unreadCount: 0, // À implémenter plus tard
      };
    }).filter(Boolean);

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("[CHATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

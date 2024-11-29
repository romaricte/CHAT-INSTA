import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marquer tous les messages comme lus
    const conversation = await db.conversation.findUnique({
      where: {
        id: params.conversationId,
      },
      include: {
        messages: {
          include: {
            seenBy: true
          }
        },
        participants: true
      }
    });

    if (!conversation) {
      return new NextResponse("Invalid conversation ID", { status: 400 });
    }

    // Vérifier si l'utilisateur est un participant
    const participant = conversation.participants.find(
      (participant) => participant.userId === session.user.id
    );

    if (!participant) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Marquer tous les messages non lus comme lus
    await Promise.all(
      conversation.messages.map((message) => {
        if (!message.seenBy.some((seenBy) => seenBy.userId === session.user.id)) {
          return db.messageSeen.create({
            data: {
              userId: session.user.id,
              messageId: message.id
            }
          });
        }
      })
    );

    return NextResponse.json("Messages marked as seen");
  } catch (error) {
    console.log("[MESSAGE_SEEN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { userId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Check if conversation already exists
    const existingConversation = await db.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: session.user.id,
            },
            {
              userId: userId,
            },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
        messages: {
          include: {
            seenBy: true,
            sender: true
          }
        }
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.log("[CONVERSATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

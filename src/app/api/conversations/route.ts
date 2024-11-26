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
            users: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            users: {
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
        users: {
          connect: [
            {
              id: session.user.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.log("[CONVERSATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

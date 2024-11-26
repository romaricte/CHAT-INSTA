import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { content, chatId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (!chatId) {
      return new NextResponse("Chat ID is required", { status: 400 });
    }

    const message = await db.message.create({
      data: {
        content,
        chatId,
        senderId: session.user.id,
      },
      include: {
        sender: true,
      },
    });

    await pusherServer.trigger(chatId, "incoming-message", message);

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: params.chatId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const companion = conversation.users.find(
      (user) => user.id !== session.user.id
    );

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const messages = await db.message.findMany({
      where: {
        conversationId: params.chatId,
      },
      include: {
        sender: true,
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

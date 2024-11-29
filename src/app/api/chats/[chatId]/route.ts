import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();
    const { chatId } = params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get conversation and check if user is participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // Calculate statistics
    const messageCount = conversation.messages.length;
    const participantCount = conversation.participants.length;

    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;
    for (let i = 1; i < conversation.messages.length; i++) {
      const currentMessage = conversation.messages[i];
      const previousMessage = conversation.messages[i - 1];
      
      if (currentMessage.senderId !== previousMessage.senderId) {
        const responseTime = new Date(currentMessage.createdAt).getTime() -
          new Date(previousMessage.createdAt).getTime();
        totalResponseTime += responseTime;
        responseCount++;
      }
    }
    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount / 1000 : 0;

    // Messages by hour
    const messagesByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: conversation.messages.filter(
        (msg) => new Date(msg.createdAt).getHours() === hour
      ).length,
    }));

    // Messages by user
    const messagesByUser = conversation.participants.map((user) => ({
      userId: user.userId,
      userName: user.userId === session.user.id ? "You" : user.user.name,
      count: conversation.messages.filter((msg) => msg.senderId === user.userId)
        .length,
    }));

    // Active hours (weighted by message count)
    const activeHours = messagesByHour.map(({ hour, count }) => ({
      hour,
      activity: count / messageCount,
    }));

    return NextResponse.json({
      messageCount,
      participantCount,
      averageResponseTime,
      messagesByHour,
      messagesByUser,
      activeHours,
    });
  } catch (error) {
    console.log("[CHAT_STATS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

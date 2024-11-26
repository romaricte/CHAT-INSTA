import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await pusherServer.trigger("presence-online", "user-online", session.user.id);

    return new NextResponse("OK");
  } catch (error) {
    console.log("[PRESENCE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await pusherServer.trigger("presence-online", "user-offline", session.user.id);

    return new NextResponse("OK");
  } catch (error) {
    console.log("[PRESENCE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

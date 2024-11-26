import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json(currentUser);
  } catch (error) {
    console.log("[CURRENT_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

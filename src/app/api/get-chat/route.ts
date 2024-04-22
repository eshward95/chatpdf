import { db } from "@/lib/db";
import { chats as _chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";
export const POST = async (request: Request) => {
  try {
    const { uid } = await request.json();
    const count = (await db.select().from(_chats).where(eq(_chats.userId, uid)))
      .length;
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.log("err=>", error);
  }
};

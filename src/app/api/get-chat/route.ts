import { db } from "@/lib/db";
import { chats as _chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";
export const POST = async (request: Request) => {
  try {
    const { chatId, uid } = await request.json();
    const chats = await db.select().from(_chats).where(eq(_chats.userId, uid));
    const currentChat =
      (await chats.find((chat) => chat.id === parseInt(chatId))) || chats[0];
    return NextResponse.json({ _chats: chats, currentChat }, { status: 200 });
  } catch (error) {
    console.log("err=>", error);
  }
};

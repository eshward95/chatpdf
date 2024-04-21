import { db } from "@/lib/db";
import { chats as _chats, messages } from "@/lib/db/schema";
import { deleteFromS3 } from "@/lib/s3";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";
export const POST = async (request: Request) => {
  try {
    const { chatId, file_key } = await request.json();
    await deleteFromS3(file_key);
    await db.delete(messages).where(eq(messages.chatId, chatId));
    const chats = await db.delete(_chats).where(eq(_chats.id, chatId));
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.log("err=>", error);
  }
  // console.log("object",request.);
};

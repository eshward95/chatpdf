import { db } from "@/lib/db";
import { messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export const runtime = "edge";
export const POST = async (request: Request) => {
  try {
    const { chatId } = await request.json();
    const messages = await db
      .select()
      .from(_messages)
      .where(eq(_messages.chatId, chatId));
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.log("err=>", error);
  }
  // console.log("object",request.);
};

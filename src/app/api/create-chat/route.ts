//api/create-chat

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  try {
    const { file_key, file_name, uuid } = await request.json();
    await loadS3IntoPinecone(file_key);

    const chat_id = await db
      .insert(chats)
      .values({
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: uuid,
        pdf_timestamp: new Date(),
        // createdAt: new Date(),
        fileKey: file_key,
      })
      .returning({ insertedId: chats.id });
    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

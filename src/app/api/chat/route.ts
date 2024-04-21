import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { messages as _messages, chats } from "@/lib/db/schema";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

  if (_chats.length != 1) {
    return NextResponse.json({ error: "chat not found" }, { status: 404 });
  }
  const fileKey = _chats[0].fileKey;
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);

  const prompt = {
    role: "system",
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
  };

  const response = await await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      prompt,
      ...messages.filter((message: Message) => message.role === "user"),
    ],
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onStart: async () => {
      await db.insert(_messages).values({
        chatId: chatId,
        content: lastMessage.content,
        role: "user",
        createdAt: new Date(),
      });
    },
    onCompletion: async (completion) => {
      await db.insert(_messages).values({
        chatId: chatId,
        content: completion,
        role: "system",
        createdAt: new Date(),
      });
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

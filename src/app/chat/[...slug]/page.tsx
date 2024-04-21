// type Props = {
//   params: {
//     chatId: string;
//   };
// };

import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ChatPage = async ({ params: { slug } }: any) => {
  const [uid, chatId] = slug;
  const _chats = await db.select().from(chats).where(eq(chats.userId, uid));
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-scroll">
        <div className="flex-[2] max-w-xs">
          <ChatSideBar
            chats={_chats}
            chatId={parseInt(chatId)}
            uid={parseInt(uid)}
          />
        </div>
        <div className="flex-[5] p-4 overflow-auto">
          {chatId && (
            <>
              <h2 className="font-semibold text-xl">{currentChat?.pdfName}</h2>
              <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
            </>
          )}
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent
            chatId={parseInt(chatId)}
            file_key={currentChat?.fileKey || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

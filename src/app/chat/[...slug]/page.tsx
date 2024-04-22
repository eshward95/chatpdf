import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Menu } from "lucide-react";

export const fetchCache = "force-no-store";
const ChatPage = async ({ params: { slug } }: any) => {
  const [uid, chatId] = slug;
  const _chats = await db.select().from(chats).where(eq(chats.userId, uid));
  const currentChat = await _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex lg:flex-row lg:justify-start h-screen">
      {/* Sheet for mobile view */}
      <div className="lg:hidden py-4">
        <Sheet>
          <SheetTrigger className="p-2">
            <Menu className="lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <ChatSideBar
              chats={_chats}
              chatId={parseInt(chatId)}
              uid={parseInt(uid)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Permanent sidebar for larger screens */}
      <div className="hidden lg:block lg:flex-[2] max-w-xs">
        <ChatSideBar
          chats={_chats}
          chatId={parseInt(chatId)}
          uid={parseInt(uid)}
        />
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-scroll">
        {/* PDFViewer and ChatComponent now arranged in column */}
        <div className="flex-1 p-4">
          {chatId && (
            <>
              <h2 className="font-semibold text-xl truncate">
                {currentChat?.pdfName}
              </h2>
              <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
            </>
          )}
        </div>

        <div className="flex-1 border-t lg:border-t-0 lg:border-l lg:border-l-slate-200">
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

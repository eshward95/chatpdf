"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatComponent from "./ChatComponent";
import ChatSideBar from "./ChatSideBar";
import PDFViewer from "./PDFViewer";

type Props = {
  chatId: string;
  uid: string;
};

const ChatsPage = ({ chatId, uid }: Props) => {
  let { data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await axios.post(`/api/get-chat`, { chatId, uid });
      return res.data;
    },
  });
  const { _chats, currentChat } = data || {};
  if (!_chats || !currentChat) return <></>;
  return (
    <div>
      {" "}
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

export default ChatsPage;

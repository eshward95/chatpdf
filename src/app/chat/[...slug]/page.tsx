// type Props = {
//   params: {
//     chatId: string;
//   };
// };

import ChatsPage from "@/components/ChatsPage";

const ChatPage = async ({ params: { slug } }: any) => {
  const [uid, chatId] = slug;
  // const _chats = await db.select().from(chats).where(eq(chats.userId, uid));
  // const currentChat = await _chats.find((chat) => chat.id === parseInt(chatId));
  // console.log("uid", uid);
  // console.log("Slug", slug);
  // console.log("current chat", currentChat);
  // console.log("_chats", _chats);

  return (
    <div className="flex flex-col h-screen">
      <ChatsPage uid={uid} chatId={chatId} />
    </div>
  );
};

export default ChatPage;

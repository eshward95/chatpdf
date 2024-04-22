"use client";
import { useUserUuid } from "@/hooks/useUserId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "ai";
import { useChat } from "ai/react";
import axios from "axios";
import { RotateCcwIcon, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import MessageList from "./MessageList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
type Props = {
  chatId: number;
  file_key: string;
};

const ChatComponent = ({ chatId, file_key }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const uuid = useUserUuid();
  const messageContainer = useRef<HTMLDivElement>(null);
  let { data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await axios.post<Message[]>(`/api/get-messages`, { chatId });
      return res.data;
    },
  });
  const { handleInputChange, handleSubmit, input, setMessages, messages } =
    useChat({
      api: "/api/chat",
      body: {
        chatId,
      },
      initialMessages: data || [],
      onFinish() {
        queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      },
    });

  const { mutate: mutateReset } = useMutation({
    mutationFn: async ({ chatId }: { chatId: number }) => {
      await axios.post("/api/reset-chat", { chatId });
    },
    onSuccess: () => {
      setMessages([]);
      return queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });
  const { mutate: mutateDelete } = useMutation({
    mutationFn: async ({
      chatId,
      file_key,
    }: {
      chatId: number;
      file_key: string;
    }) => {
      await axios.post("/api/delete-chat", { chatId, file_key });
    },
    onSuccess: () => {
      setMessages([]);
      router.replace(`/chat/${uuid}`);
      router.refresh();
      return queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });
  // const [messages, setMessages] = useState<Message[]>(data! || []);

  React.useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTo({
        top: messageContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="relative max-h-screen overflow-scroll"
      ref={messageContainer}
    >
      <div className="inset-x-0 sticky top-0 p-2 bg-white h-fit flex items-center justify-between">
        <h3 className="text-xl font-bold">Chat</h3>
        <div className="flex gap-2 cursor-pointer">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                {/* <Button variant="ghost" className="text-slate-500 text-xs p-0"> */}
                <Trash2
                  className="cursor-pointer text-red-500"
                  onClick={() => mutateDelete({ chatId, file_key })}
                />
                {/* </Button>  */}
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="bg-secondary-foreground text-secondary p-2"
              >
                Delete chat
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <RotateCcwIcon
                  className="cursor-pointer text-slate-500"
                  onClick={() => mutateReset({ chatId })}
                />
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="bg-secondary-foreground text-secondary p-2"
              >
                Reset chat
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <Button
            onClick={() => mutateReset({ chatId })}
            variant="ghost"
            className="text-slate-500 text-xs p-0"
          >
            <RotateCcwIcon />
          </Button> */}
        </div>
      </div>

      <MessageList messages={messages} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 py-4 px-2 bg-white flex"
      >
        <Input
          placeholder="Ask any question"
          className="w-full"
          onChange={handleInputChange}
          value={input}
        />
        <Button type="submit" className="bg-purple-500 ml-2">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;

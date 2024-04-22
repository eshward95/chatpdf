"use client";
import FileUpload from "@/components/FileUpload";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserId";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const uuid = useUserUuid();
  if (!uuid) {
    return <PageLoader/>;
  }
  return (
    <main className="justify-center px-2 items-center flex w-screen min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-200 via-red-200 to-yellow-100">
      <div className="justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl text-center">Chat with any PDF</h1>
          </div>
          {/* <div className="flex items-center"> */}
          <p className="max-w-xl text-lg mt-2 text-slate-600 text-center">
            Effortlessly work with PDFs using an AI-powered platform that makes
            reading, discussing, and getting support easy and efficient.
          </p>
          <Link href={`/chat/${uuid}`}>
            <Button className="mt-4">Go to chats</Button>
          </Link>
          <div className={cn("w-full mt-4")}>
            <FileUpload uid={uuid!} />
          </div>
        </div>
        <footer className="text-center border-t border-neutral-200 dark:border-neutral-700">
          <h1
            className="font-semibold text-md bg-gradient-to-tl from-indigo-400 via-fuchsia-500 to-rose-500
           my-3
        inline-block text-transparent bg-clip-text"
          >
            Made with :) by ED
          </h1>
        </footer>
      </div>
    </main>
  );
}

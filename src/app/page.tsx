"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserId";
import Link from "next/link";

export default function Home() {
  const uuid = useUserUuid();
  return (
    <main className="flex w-screen min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl">Chat with any PDF</h1>
          </div>
          {/* <div className="flex items-center"> */}
          <p className="max-w-xl text-lg mt-2 text-slate-600 text-center">
            Effortlessly work with PDFs using an AI-powered platform that makes
            reading, discussing, and getting support easy and efficient.
          </p>
          <Link href={`/chat/${uuid}`}>
            <Button className="mt-4">Go to chats</Button>
          </Link>
          {/* </div> */}
          <div className="w-full mt-4">
            <FileUpload />
          </div>
        </div>
      </div>
    </main>
  );
}

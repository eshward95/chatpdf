"use client";

import { useUserUuid } from "@/hooks/useUserId";
import { uploadToS3 } from "@/lib/s3";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircleXIcon, Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
type Props = {
  uid: string;
};

const FileUpload = ({ uid }: Props) => {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const uuid = useUserUuid();
  // console.log(uid, uuid);
  let { data: { count = 0 } = {} } = useQuery({
    queryKey: ["uuid", uuid],
    queryFn: async () => {
      const res = await axios.post(`/api/get-chat`, { uid });
      return res.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
        uuid: uid || uuid,
      });
      return response.data;
    },
  });
  const { getInputProps, getRootProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 30 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file, (progress) => {
          // console.log("Progress:", progress);
        });
        // console.log(data);
        mutate(data!, {
          onSuccess: ({ chat_id }) => {
            // console.log(chat_id, uid, uuid);
            router.push(`chat/${uid || uuid}/${chat_id}`);
            toast.success("Success");
          },
          onError: (error) => {
            console.log(error);
            toast.error("Something is wrong");
          },
          onSettled() {
            setUploading(false);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
  });
  // console.log("data", count);
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-dashed events-none rounded-xl flex py-8 bg-gray-50 flex-col cursor-pointer align-middle items-center justify-center",
            {
              "pointer-events-none cursor-not-allowed border-red-600":
                count >= 5,
            }
          ),
        })}
      >
        <input {...getInputProps()} />
        <>
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
              <p className="mt-2 text-center text-sm text-slate-500">
                Uploading...
              </p>
            </>
          ) : (
            <>
              {count >= 5 ? (
                <>
                  <CircleXIcon className="h-10 w-10 text-red-600" />
                  <p className="mt-2 text-center text-sm text-slate-500">
                    You can upload up to 5 PDFs. Delete some from the chat and
                    then try uploading.
                  </p>
                </>
              ) : (
                <>
                  <Inbox className="h-10 w-10 text-purple-500" />
                  <p className="mt-2 text-center text-sm text-slate-500">
                    Upload PDF here.
                  </p>
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default FileUpload;

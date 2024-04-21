"use client";
// hooks/useUserUuid.ts
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { useEffect, useState } from "react";

const USER_UUID_KEY = "userUuid";

export const useUserUuid = (): string => {
  // Initialize state with undefined or empty string,
  // since we cannot access localStorage during SSR
  const [uuid, setUuid] = useState<string>();
  useEffect(() => {
    // Define a function to retrieve or create UUID
    const getOrCreateUuid = async () => {
      let userUuid = localStorage.getItem(USER_UUID_KEY);
      if (!userUuid) {
        userUuid = await getCurrentBrowserFingerPrint();
        localStorage.setItem(USER_UUID_KEY, userUuid);
      }
      setUuid(userUuid);
    };
    getOrCreateUuid();
  }, []);

  return uuid ?? "";
};

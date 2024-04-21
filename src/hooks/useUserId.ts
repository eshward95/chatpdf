import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const USER_UUID_KEY = "userUuid";

export const useUserUuid = (): string | undefined => {
  const [uuid, setUuid] = useState<string | undefined>();
  const params = useParams<{ slug: string }>();
  // console.log(params.slug[0]);
  const slugs = params && params?.slug?.[0];
  useEffect(() => {
    const getOrCreateUuid = async () => {
      let userUuid = localStorage.getItem(USER_UUID_KEY);
      const checkUserId = await getCurrentBrowserFingerPrint();

      if (!userUuid) {
        // No UUID in local storage, so save the newly generated one
        localStorage.setItem(USER_UUID_KEY, checkUserId);
        setUuid(checkUserId);
      } else if (
        userUuid &&
        checkUserId &&
        userUuid !== checkUserId.toString()
      ) {
        // UUID in local storage does not match the generated one,
        // handle this case as per your application logic
        toast.error("invalid session", { id: "invalid_session" });
        setUuid(checkUserId.toString());
        window.location.replace("/");
        localStorage.clear();
      } else {
        // UUID matches, no need to do anything
        setUuid(userUuid);
      }
    };

    if (typeof window !== "undefined") {
      // Ensure localStorage is accessible (i.e., not during SSR)
      getOrCreateUuid();
    }
  }, []);
  useEffect(() => {
    if (uuid && slugs && uuid !== slugs) {
      toast.error("invalid session", { id: "invalid_session" });
      localStorage.clear();
      window.location.replace("/");
    }
  }, [slugs, uuid]);

  return uuid;
};

"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import { getFidCreationDate } from "@/services/base";
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [user, setUser] = useState<{
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
      const result = await sdk.isInMiniApp();
      setIsInMiniApp(result);

      if (result) {
        try {
          const context = await sdk.context;
          const userData = context.user;

          if (userData && userData.fid) {
            setUser({
              fid: userData.fid,
              username: userData.username,
              displayName: userData.displayName,
              pfpUrl: userData.pfpUrl,
            });
          } else {
            await sdk.actions.signIn({
              nonce: "dsjshjdsiuWHRHHRH",
              acceptAuthAddress: true,
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          await sdk.actions.signIn({
            nonce: "dsjshjdsiuWHRHHRH",
            acceptAuthAddress: true,
          });
        }
      }
    };

    if (!isLoaded) {
      load();
    }
  }, [isLoaded]);

  return (
    <main className="min-h-screen bg-gray-50 text-black  p-6">
      {/* <NeynarAuthButton /> */}
      {isInMiniApp ? (
        user ? (
          <>
            <UserHeader user={user} />
            <UserCast user={user} />
          </>
        ) : (
          <div className="text-lg text-gray-700">Prompting sign-in...</div>
        )
      ) : (
        <div className="text-lg text-red-500">Not welcome here</div>
      )}
    </main>
  );
}

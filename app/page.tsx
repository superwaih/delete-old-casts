"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import LandingPage from "@/components/landing-page";

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
    <>
      {isInMiniApp ? (
        user ? (
          <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
              <UserHeader user={user} />
            </div>

            {/* Main Content */}
            <div className="pb-6">
              <UserCast user={user} />
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">
                Connecting to Farcaster...
              </p>
            </div>
          </div>
        )
      ) : (
        <LandingPage />
      )}
    </>
  );
}

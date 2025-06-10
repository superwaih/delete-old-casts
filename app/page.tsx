"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { User } from "lucide-react";

export default function HomeAlternative() {
  const { user, isAuthenticated } = useNeynarContext();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isCheckingMiniApp, setIsCheckingMiniApp] = useState(true);
  const [farcasterUser, setFarcasterUser] = useState(null);

  useEffect(() => {
    const checkMiniAppAndInitializeSDK = async () => {
      try {
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);

        if (miniAppResult) {
          await sdk.actions.ready();
          await sdk.actions.addMiniApp();

          // Get user context from Farcaster SDK
          try {
            const context = await sdk.context;
            if (context?.user) {
              setFarcasterUser(context.user);
            }
          } catch (error) {
            console.error("Error getting Farcaster context:", error);
          }
        }

        setIsSDKReady(true);
      } catch (error) {
        console.error("Error checking mini app or initializing SDK:", error);
        setIsSDKReady(true);
      } finally {
        setIsCheckingMiniApp(false);
      }
    };

    checkMiniAppAndInitializeSDK();
  }, []);

  const handleMiniAppAuth = async () => {
    try {
      // For mini apps, we can try to open the auth URL in the same window
      // or use a different authentication strategy
      const authUrl = `${window.location.origin}/auth/neynar?miniapp=true`;

      // Use the Farcaster SDK to open the URL
      if (isInMiniApp) {
        await sdk.actions.openUrl(authUrl);
      } else {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error("Error with mini app auth:", error);
    }
  };

  if (isCheckingMiniApp || (isInMiniApp && !isSDKReady)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            {isCheckingMiniApp ? "Loading..." : "Initializing..."}
          </p>
        </div>
      </div>
    );
  }

  const isUserAuthenticated = isInMiniApp ? !!farcasterUser : isAuthenticated;
  const currentUser = isInMiniApp ? farcasterUser : user;

  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Bulk Cast Manager
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in with your Farcaster account to manage your casts
          </p>
          <div className="flex justify-center">
            {isInMiniApp ? (
              <button
                onClick={handleMiniAppAuth}
                className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white hover:bg-gray-800 transition-colors"
              >
                Sign in with Farcaster
              </button>
            ) : (
              <NeynarAuthButton className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white" />
            )}
          </div>
          {isInMiniApp && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                Running in Farcaster mini app mode
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <UserHeader user={currentUser} />
      </div>
      <div className="pb-6">
        <UserCast user={currentUser} />
      </div>
    </div>
  );
}

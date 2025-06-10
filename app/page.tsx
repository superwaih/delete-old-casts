"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { User } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useNeynarContext();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isCheckingMiniApp, setIsCheckingMiniApp] = useState(true);

  useEffect(() => {
    const checkMiniAppAndInitializeSDK = async () => {
      try {
        // First check if we're in a mini app
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);

        if (miniAppResult) {
          // Only initialize SDK if we're in a mini app
          await sdk.actions.ready();
          await sdk.actions.addMiniApp()
        }

        setIsSDKReady(true);
      } catch (error) {
        console.error("Error checking mini app or initializing SDK:", error);
        // Set ready to true even if check fails to ensure app still works
        setIsSDKReady(true);
      } finally {
        setIsCheckingMiniApp(false);
      }
    };

    checkMiniAppAndInitializeSDK();
  }, []);

  // Show loading screen while checking mini app status and initializing SDK if needed
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

  if (!isAuthenticated) {
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
            <NeynarAuthButton
              className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white"
            />
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <UserHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="pb-6">
        <UserCast user={user} />
      </div>
    </div>
  );
}

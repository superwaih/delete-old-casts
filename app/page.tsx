"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react";
import { User } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useNeynarContext();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isCheckingMiniApp, setIsCheckingMiniApp] = useState(true);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    const checkMiniAppAndInitializeSDK = async () => {
      try {
        // Dynamically import the SDK to avoid SSR issues
        
        // First check if we're in a mini app
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);
        
        if (miniAppResult) {
          // Only initialize SDK if we're in a mini app
          await sdk.actions.ready();
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

  const copyUrlToClipboard = async () => {
    try {
      // Replace with your actual website URL
      await navigator.clipboard.writeText('https://delete-old-casts.vercel.app/');
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

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

  // If we're in a mini app and not authenticated, show the instruction flow
  if (isInMiniApp && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 w-full max-w-full">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <User className="text-white mr-3 w-8 h-8" />
              <h1 className="text-2xl font-bold text-white">
                Bulk Cast Manager
              </h1>
            </div>
            <div className="px-4 space-y-4">
              {/* Step 1 Card */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold text-lg mb-3">1) Visit our website</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Open the desktop/mobile site to grant permissions. You only need to do this the first time signing into our app - after that it's automatic!
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={copyUrlToClipboard}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    <span>Copy Website URL By Tapping</span>
                  </button>
                </div>
                {urlCopied && (
                  <div className="mt-2 text-center">
                    <span className="text-green-400 text-sm font-medium">✓ Copied to clipboard!</span>
                  </div>
                )}
              </div>
              
              {/* Step 2 Card */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold text-lg mb-3">2) Grant permissions</h3>
                <p className="text-gray-300 text-sm">
                  Click the <span className="text-purple-400 font-semibold">"Sign in with Neynar"</span> button to give us permission to manage your casts.
                </p>
              </div>
              
              {/* Step 3 Card */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold text-lg mb-3">3) Return & start managing</h3>
                <p className="text-gray-300 text-sm">
                  Come back to the mini app after granting permissions. You'll be automatically signed in and ready to manage your casts! 
                  <span className="text-purple-400"> Refresh in the top right corner if needed.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not in mini app and not authenticated, show normal auth flow
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
              variant={SIWN_variant.NEYNAR}
              className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  // Loading user data
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

  // Main authenticated app
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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { sdk } from "@farcaster/frame-sdk";
import { User, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const { user, isAuthenticated } = useNeynarContext();
  const router = useRouter();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);

        if (miniAppResult) {
          await sdk.actions.ready();
        }
      } catch (error) {
        console.error("Error initializing auth page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // If user is authenticated, redirect back to main app
    if (isAuthenticated && user) {
      const redirectToMain = async () => {
        if (isInMiniApp) {
          // Close the auth window and return to main app
          try {
            await sdk.actions.close();
          } catch (error) {
            console.error("Error closing auth window:", error);
            // Fallback: navigate back to main page
            router.push("/");
          }
        } else {
          router.push("/");
        }
      };

      redirectToMain();
    }
  }, [isAuthenticated, user, isInMiniApp, router]);

  const handleBackToMain = async () => {
    if (isInMiniApp) {
      try {
        await sdk.actions.close();
      } catch (error) {
        console.error("Error closing auth window:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        {/* Back button for miniapp */}
        {isInMiniApp && (
          <button
            onClick={handleBackToMain}
            className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        )}

        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
          <User className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authenticate with Neynar
        </h1>

        <p className="text-gray-600 mb-8">
          Connect your Farcaster account to continue using Bulk Cast Manager
        </p>

        {isInMiniApp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              🔗 Authentication opened in miniapp mode
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <NeynarAuthButton className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white hover:bg-gray-800 transition-colors" />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          After authentication, you'll be redirected back to the main app
        </p>
      </div>
    </div>
  );
}

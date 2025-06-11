"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sdk } from "@farcaster/frame-sdk";
import { useNeynarContext } from "@neynar/react";
import { CheckCircle } from "lucide-react";

export default function AuthSuccessPage() {
  const { user, isAuthenticated } = useNeynarContext();
  const router = useRouter();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const initializeSuccess = async () => {
      try {
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);

        if (miniAppResult) {
          await sdk.actions.ready();
        }
      } catch (error) {
        console.error("Error initializing success page:", error);
      }
    };

    initializeSuccess();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReturnToMain();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated, user]);

  const handleReturnToMain = async () => {
    if (isInMiniApp) {
      try {
        await sdk.actions.close();
      } catch (error) {
        console.error("Error closing success window:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome, {user?.displayName || user?.username || "User"}! You're now
          authenticated and ready to use Bulk Cast Manager.
        </p>

        {isInMiniApp && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              ✅ Successfully authenticated in miniapp mode
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Returning to main app in {countdown} seconds...
          </p>
        </div>

        <button
          onClick={handleReturnToMain}
          className="bg-gray-700 p-3 cursor-pointer rounded-md flex items-center text-white hover:bg-gray-800 transition-colors mx-auto"
        >
          Return to App Now
        </button>
      </div>
    </div>
  );
}

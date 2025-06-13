"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import { getCurrentSigner, signOut } from "@/lib/authkit";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import AuthButton from "@/components/auth-button";
import { User, AlertCircle } from "lucide-react";
import { Toaster } from "sonner";

interface UserData {
  signerUuid: string;
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

interface FarcasterUser {
  username?: string;
  displayName?: string;
  fid: number;
  [key: string]: any;
}

export default function Home() {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isCheckingMiniApp, setIsCheckingMiniApp] = useState(true);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(
    null
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMiniAppAndInitializeSDK = async () => {
      try {
        const miniAppResult = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppResult);

        if (miniAppResult) {
          await sdk.actions.ready();
          await sdk.actions.addMiniApp();

          try {
            const context = await sdk.context;
            if (context?.user) {
              //@ts-ignore
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

  // Check for existing authentication
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentSigner = await getCurrentSigner();
        if (currentSigner && currentSigner.signerUuid) {
          setUserData({
            signerUuid: currentSigner.signerUuid,
            fid: currentSigner.fid,
            username: currentSigner.username || "",
            displayName: currentSigner.displayName || "",
            pfpUrl: currentSigner.pfpUrl || "",
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Listen for AuthKit state changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fc_auth_kit") {
        if (e.newValue) {
          try {
            const parsedState = JSON.parse(e.newValue);
            if (
              parsedState?.status === "authenticated" &&
              parsedState?.session
            ) {
              const { message, signer } = parsedState.session;
              if (signer?.signerUuid) {
                setUserData({
                  signerUuid: signer.signerUuid,
                  fid: message.fid,
                  username: message.username || "",
                  displayName: message.displayName || "",
                  pfpUrl: message.pfpUrl || "",
                });
              }
            } else if (parsedState?.status === "error") {
              setAuthError("Authentication failed");
            }
          } catch (error) {
            console.error("Error parsing auth state:", error);
          }
        } else {
          // Auth state cleared
          setUserData(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAuthSuccess = (data: UserData) => {
    setUserData(data);
    setAuthError(null);
  };

  const handleAuthError = (error: Error) => {
    console.error("Authentication error:", error);
    setAuthError(error.message || "Failed to authenticate. Please try again.");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserData(null);
      // Force reload to clear AuthKit state completely
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isCheckingMiniApp || (isInMiniApp && !isSDKReady) || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            {isCheckingMiniApp
              ? "Loading..."
              : isLoading
              ? "Checking authentication..."
              : "Initializing Farcaster SDK..."}
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
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
            Sign in with Farcaster to manage your casts
          </p>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Authentication Error
                  </p>
                  <p className="text-sm text-red-700">{authError}</p>
                </div>
              </div>
            </div>
          )}

          <AuthButton onSuccess={handleAuthSuccess} onError={handleAuthError} />

          {isInMiniApp && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                🚀 Running in Farcaster mini app mode
                {farcasterUser && (
                  <span className="block mt-1 font-medium">
                    Farcaster Context:{" "}
                    {farcasterUser.displayName || farcasterUser.username}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              💡 Sign in with Farcaster to view and manage your casts. No
              additional permissions needed!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Toaster position="top-center" />
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <UserHeader
          user={{
            username: userData.username,
            display_name: userData.displayName,
            pfp_url: userData.pfpUrl,
            follower_count: 0, // You would need to fetch this separately
            following_count: 0, // You would need to fetch this separately
          }}
          onSignOut={handleSignOut}
        />
      </div>

      <div className="pb-6">
        <UserCast
          user={{
            fid: userData.fid,
            username: userData.username,
            display_name: userData.displayName,
            pfp_url: userData.pfpUrl,
          }}
          signerUuid={userData.signerUuid}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import QRCodeDisplay from "@/components/qr-code-display";
import { User } from "lucide-react";

interface SignerData {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url: string;
}

interface UserData {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
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
  const [signerData, setSignerData] = useState<SignerData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCreatingSigner, setIsCreatingSigner] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // Check for existing signer in localStorage
  useEffect(() => {
    const storedSignerUuid = localStorage.getItem("signer_uuid");
    if (storedSignerUuid) {
      checkSignerStatus(storedSignerUuid);
    }
  }, []);

  const checkSignerStatus = async (signerUuid: string) => {
    try {
      const response = await fetch(`/api/user?signer_uuid=${signerUuid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.signer?.status === "approved") {
          setUserData(data.user);
          setSignerData(data.signer);
        } else {
          localStorage.removeItem("signer_uuid");
        }
      } else {
        // Signer doesn't exist, remove from storage
        localStorage.removeItem("signer_uuid");
      }
    } catch (error) {
      console.error("Error checking signer status:", error);
      localStorage.removeItem("signer_uuid");
    }
  };

  const createSigner = async () => {
    setIsCreatingSigner(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/signer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create signer");
      }

      const data: SignerData = await response.json();
      setSignerData(data);
      localStorage.setItem("signer_uuid", data.signer_uuid);
      console.log(data.signer_uuid);
    } catch (error) {
      console.error("Error creating signer:", error);
      setAuthError("Failed to create signer. Please try again.");
    } finally {
      setIsCreatingSigner(false);
    }
  };

  const handleSignerApproved = async () => {
    if (!signerData) return;
    try {
      const response = await fetch(
        `/api/user?signer_uuid=${signerData.signer_uuid}${
          farcasterUser?.fid ? `&fid=${farcasterUser.fid}` : ""
        }`
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthError("Failed to fetch user data after approval.");
    }
  };

  const handleSignOut = () => {
    // Clear all user data from state
    localStorage.removeItem("signer_uuid");
    sessionStorage.clear(); // Clear any session data

    // Reset all state variables related to user
    setSignerData(null);
    setUserData(null);

    // Clear any cached data
    if (window.caches) {
      // Optional: clear specific caches if needed
      // This is advanced and might not be necessary in most cases
    }
  };

  if (isCheckingMiniApp || (isInMiniApp && !isSDKReady)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            {isCheckingMiniApp ? "Loading..." : "Initializing Farcaster SDK..."}
          </p>
        </div>
      </div>
    );
  }

  if (signerData && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <QRCodeDisplay
          approvalUrl={signerData.signer_approval_url}
          onApproved={handleSignerApproved}
          signerUuid={signerData.signer_uuid}
        />
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
            Create a managed signer to interact with Farcaster
          </p>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          )}

          <button
            onClick={createSigner}
            disabled={isCreatingSigner}
            className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
          >
            {isCreatingSigner ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Signer...
              </>
            ) : (
              "Sign in to farcaster"
            )}
          </button>

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
              💡 Managed signers allow the app to show your casts. The signer
              creation is sponsored - you won't pay any fees!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <UserHeader user={userData} onSignOut={handleSignOut} />
      </div>

      <div className="pb-6">
        <UserCast user={userData} signerUuid={signerData?.signer_uuid} />
      </div>
    </div>
  );
}

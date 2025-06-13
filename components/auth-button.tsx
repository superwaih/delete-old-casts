"use client";

import { useState } from "react";
import { SignInButton } from "@farcaster/auth-kit";
import { User, Loader2 } from "lucide-react";

interface AuthButtonProps {
  onSuccess: (data: {
    signerUuid: string;
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  }) => void;
  onError: (error: Error) => void;
}

export default function AuthButton({ onSuccess, onError }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async () => {
    setIsLoading(true);
    try {
      // Access the AuthKit state from localStorage
      const authState = localStorage.getItem("fc_auth_kit");
      if (!authState) {
        throw new Error("Authentication state not found");
      }

      const parsedState = JSON.parse(authState);
      if (parsedState?.status === "authenticated" && parsedState?.session) {
        const { message, signer } = parsedState.session;

        if (signer?.signerUuid) {
          onSuccess({
            signerUuid: signer.signerUuid,
            fid: message.fid,
            username: message.username || "",
            displayName: message.displayName || "",
            pfpUrl: message.pfpUrl || "",
          });
        } else {
          onError(
            new Error("Authentication successful but signer data is incomplete")
          );
        }
      } else {
        onError(new Error("Authentication failed"));
      }
    } catch (error) {
      console.error("Error getting auth status:", error);
      onError(
        error instanceof Error ? error : new Error("Failed to get auth status")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: Error) => {
    console.error("Sign in error:", error);
    onError(error);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <button
          disabled
          className="bg-gray-700 p-4 cursor-not-allowed rounded-md flex items-center justify-center text-white w-full opacity-70"
        >
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Authenticating...
        </button>
      ) : (
        <SignInButton
          onSuccess={handleSuccess}
        //   onError={handleError}
          className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center justify-center text-white hover:bg-gray-800 transition-colors w-full"
        >
          <User className="w-4 h-4 mr-2" />
          Sign in with Farcaster
        </SignInButton>
      )}
    </div>
  );
}

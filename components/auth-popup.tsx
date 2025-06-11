"use client";

import { useEffect, useState } from "react";
import { NeynarAuthButton } from "@neynar/react";
import { X } from "lucide-react";

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthPopup({
  isOpen,
  onClose,
  onSuccess,
}: AuthPopupProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Authenticate with Neynar
          </h2>
          <p className="text-gray-600 mb-6">
            Complete authentication in this popup to avoid page reloads
          </p>

          <div className="flex justify-center">
            <NeynarAuthButton className="bg-gray-700 p-4 cursor-pointer rounded-md flex items-center text-white hover:bg-gray-800 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

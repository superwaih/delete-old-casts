"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { Button } from "./button";

interface QRCodeDisplayProps {
  approvalUrl: string;
  onApproved: () => void;
  signerUuid: string;
}

export default function QRCodeDisplay({
  approvalUrl,
  onApproved,
  signerUuid,
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  // Poll for signer approval
  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        console.log("Polling signer status for:", signerUuid);

        const response = await fetch(`/api/user?signer_uuid=${signerUuid}`);
        const data = await response.json();

        console.log("Poll response:", { status: response.status, data });

        if (response.ok) {
          if (data.signer?.status === "approved") {
            console.log("Signer approved! User data:", data.user);
            setIsPolling(false);
            onApproved();
          }
        } else {
          // Log the error but continue polling unless it's a permanent error
          console.log("Polling error (continuing):", data);

          // If signer is not found, stop polling
          if (response.status === 404) {
            console.error("Signer not found, stopping poll");
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error("Error polling signer status:", error);
        // Continue polling on network errors
      }
    }, 3000); // Increased to 3 seconds to avoid rate limiting

    return () => clearInterval(pollInterval);
  }, [signerUuid, onApproved, isPolling]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(approvalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const openInWarpcast = () => {
    window.open(approvalUrl, "_blank");
  };

  return (
    <div className="max-w-md mx-auto text-center p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Approve Signer
      </h2>

      <p className="text-gray-600 mb-6">
        Scan this QR code with your phone or click the link to approve the
        signer in Warpcast
      </p>

      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6 inline-block">
        <QRCodeSVG value={approvalUrl} size={200} />
      </div>

      <div className="space-y-3">
        <Button
          onClick={openInWarpcast}
          className="w-full cursor-pointer"
          variant="outline"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in Warpcast
        </Button>

        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          💡 This will create a signer that allows the app to post on your
          behalf. The transaction is sponsored, so you won't pay any fees.
        </p>
      </div>

      {isPolling && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></div>
          Waiting for approval...
        </div>
      )}
    </div>
  );
}

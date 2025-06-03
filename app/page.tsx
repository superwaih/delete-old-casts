"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [user, setUser] = useState<{
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
      const result = await sdk.isInMiniApp();
      setIsInMiniApp(result);
      console.log("sdk", result);

      if (result) {
        try {
          const context = await sdk.context;
          const userData = context.user; // Access the user object from context
          console.log("User Data:", userData);

          if (userData && userData.fid) {
            setUser({
              fid: userData.fid,
              username: userData.username,
              displayName: userData.displayName,
              pfpUrl: userData.pfpUrl,
            });
          } else {
            await sdk.actions.signIn({
              nonce: "dsjshjdsiuWHRHHRH",
              acceptAuthAddress: true,
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          await sdk.actions.signIn({
            nonce: "dsjshjdsiuWHRHHRH",
            acceptAuthAddress: true,
          });
        }
      }
    };

    if (!isLoaded) {
      load();
    }
  }, [isLoaded]);

  return (
    <main className="text-black">
      {isInMiniApp ? (
        user ? (
          <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">
              Welcome, {user.displayName || user.username || "User"}
            </h1>
            {user.pfpUrl && (
              <img
                src={user.pfpUrl}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <p>FID: {user.fid}</p>
            {user.username && <p>Username: {user.username}</p>}
            {user.displayName && <p>Display Name: {user.displayName}</p>}
          </div>
        ) : (
          <div className="p-4">Prompting sign-in...</div>
        )
      ) : (
        <div className="p-4">Not welcome here</div>
      )}
    </main>
  );
}

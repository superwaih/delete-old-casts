"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [fid, setFid] = useState<number | null>(null);
  const [client, setClient] = useState();


  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
      const result = await sdk.isInMiniApp();
      setIsInMiniApp(result);
      console.log("sdk", result);

      if (result) {
        try {
          const nclient = (await sdk.context).client
          // setClient(nclient);
          console.log("Client:", nclient);
          const user = (await sdk.context).client.clientFid
         
          if (user ) {
            setFid(user);
            console.log("User FID:", user);
          } else {
            await sdk.actions.signIn({
              nonce: 'dsjshjdsiuWHRHHRH',
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
        fid ? (
          <div>Welcome, user with FID: {fid}</div>
        ) : (
          <div>Prompting sign-in...</div>
        )
      ) : (
        <div>Not welcome here</div>
      )}
    </main>
  );
}

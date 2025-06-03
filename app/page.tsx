"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
      const result = await sdk.isInMiniApp();
      setIsInMiniApp(result);
      console.log("sdk", result);
    };
    if (sdk && !isLoaded) {
      load();
    }
  }, [isLoaded]);

  return <main className="text-black">{isInMiniApp ? <div>Min app hehehehdsiudsiusdiu</div> : <div>Not welcome here</div>}</main>;
}

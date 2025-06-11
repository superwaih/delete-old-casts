import neynarClient from "@/lib/neynar-client";
import { mnemonicToAccount } from "viem/accounts";

export const getFid = async () => {
  if (!process.env.FARCASTER_DEVELOPER_MNEMONIC) {
    throw new Error("FARCASTER_DEVELOPER_MNEMONIC is not set.");
  }

  const account = mnemonicToAccount(process.env.FARCASTER_DEVELOPER_MNEMONIC);

  const { user: farcasterDeveloper } =
    await neynarClient.lookupUserByCustodyAddress({
      custodyAddress: account.address,
    });
console.log("Farcaster Developer User:", farcasterDeveloper);
  return Number(farcasterDeveloper.fid);
};
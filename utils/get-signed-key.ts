
import { ViemLocalEip712Signer } from "@farcaster/hub-nodejs";
import { bytesToHex, hexToBytes } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { getFid } from "./get-fid";
import neynarClient from "@/lib/neynar-client";
const options = {
    sponsor: {
       sponsored_by_neynar: false
   }};

export const getSignedKey = async () => {
  const createSigner = await neynarClient.createSigner();
  const { deadline, signature } = await generate_signature(
    createSigner.public_key
  );

  if (deadline === 0 || signature === "") {
    throw new Error("Failed to generate signature");
  }

  const fid = await getFid();
    if ( !fid) {
    throw new Error("Failed to generate signature");
  }
console.log("Farcaster Developer FID:", fid);
  const signedKey = await neynarClient.registerSignedKey({
    signerUuid: createSigner.signer_uuid,
    appFid: fid,
    deadline,
    signature,
    sponsor: options.sponsor,
  });

  return signedKey;
};

const generate_signature = async function (public_key: string) {
  if (typeof process.env.FARCASTER_DEVELOPER_MNEMONIC === "undefined") {
    throw new Error("FARCASTER_DEVELOPER_MNEMONIC is not defined");
  }

  const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;
  const FID = await getFid();

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);
  const appAccountKey = new ViemLocalEip712Signer(account);

  const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const uintAddress = hexToBytes(public_key as `0x${string}`);

  const signature = await appAccountKey.signKeyRequest({
    requestFid: BigInt(FID),
    key: uintAddress,
    deadline: BigInt(deadline),
  });

  if (signature.isErr()) {
    return {
      deadline,
      signature: "",
    };
  }

  const sigHex = bytesToHex(signature.value);

  return { deadline, signature: sigHex };
};
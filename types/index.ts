export type CastMessage = {
    hash: string;
    hashScheme: string;
    signature: string;
    signatureScheme: string;
    signer: string;
    data: {
      type: "MESSAGE_TYPE_CAST_ADD";
      fid: number;
      timestamp: number;
      network: "FARCASTER_NETWORK_MAINNET";
      castAddBody: {
        text: string;
        type: "CAST";
        embeds: any[];
        embedsDeprecated: any[];
        mentions: number[];
        mentionsPositions: number[];
        parentCastId?: {
          fid: number;
          hash: string;
        } | null;
        parentUrl?: string | null;
      };
    };
  };
  export type CastResponse = {
    messages: CastMessage[];
    nextPageToken: string;
  };
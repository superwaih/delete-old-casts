import { useMutation, useQuery } from "@tanstack/react-query"
import { api, portalapi } from "./api"
import { CastResponse } from "@/types";



export const fetchUserCast = async (fid: number): Promise<CastResponse> => {
  const response = await api.get<CastResponse>("/castsByFid", {
    params: {
      fid: fid,
      limit: 10,
    },
  });
  return response.data;
};

export const useFetchUserCast = (fid: number) => {
  return useQuery({
    queryKey: ["userCast", fid],
    queryFn: () => fetchUserCast(fid),
    enabled: !!fid, // avoids running the query if fid is 0 or undefined
  });
};

const deleteCast = async (hash: string) => {
    const response = await portalapi.delete(`/farcaster/cast`, {
        data: {
            target_hash: hash,
            signer_uuid: "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec",
        }
    });
}

export const useDeleteCast = () => {
  return useMutation({
    mutationKey: ["deleteCast"],
    mutationFn: deleteCast,
  });
};

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

// const deleteCast = async (hash: string) => {
//     const response = await portalapi.delete(`/farcaster/cast`, {
//         data: {
//             target_hash: hash,
//             signer_uuid: "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec",
//         }
//     });
// }

// export const useDeleteCast = () => {
//   return useMutation({
//     mutationKey: ["deleteCast"],
//     mutationFn: deleteCast,
//   });
// };
// Fixed delete cast function with proper Neynar API endpoint
const deleteCast = async (hash: string) => {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/cast`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        api_key:  "AD46BA8E-E6EE-4628-BE42-54E07EA838C8",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        target_hash: hash,
        signer_uuid: "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to delete cast:", error)
    throw error
  }
}

export const useDeleteCast = () => {
  return useMutation({
    mutationKey: ["deleteCast"],
    mutationFn: deleteCast,
  })
}
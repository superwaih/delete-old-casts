import { useQuery } from "@tanstack/react-query"
import { api } from "./api"
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

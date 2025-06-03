import React from "react";
import { useFetchUserCast } from "@/services/neynar";
import { CastMessage } from "@/types";
import { useNeynarContext } from "@neynar/react";

type User = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
} | null;

const UserCast = ({ user }: { user: User }) => {
  const { data, isLoading } = useFetchUserCast(user?.fid ?? 0);
  const { user: userData } = useNeynarContext();
  console.log("UserCast data:", userData)
  return (
    <section className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {user?.displayName || user?.username || "User"}'s Casts
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(data?.messages?.length ?? 0) > 0 ? (
            data?.messages!.map(
              (msg: CastMessage) =>
                msg?.data?.castAddBody ? (
                  <div
                    key={msg.hash}
                    className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {msg.data.castAddBody.text}
                    </p>
                    {msg.data.castAddBody.parentCastId && (
                      <p className="mt-2 text-sm text-gray-400">
                        Replying to cast by FID{" "}
                        {msg.data.castAddBody.parentCastId.fid}
                      </p>
                    )}
                  </div>
                ) : null // Skip messages without castAddBody
            )
          ) : (
            <div className="text-gray-500 text-sm">No casts found.</div>
          )}
        </div>
      )}
    </section>
  );
};

export default UserCast;

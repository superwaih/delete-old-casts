"use client";

import { useNeynarContext } from "@neynar/react";

type UserHeaderProps = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfp_url?: string;
  };
};

export default function UserHeader() {
    const { user, logoutUser} = useNeynarContext(); // <-- add signOut
  if(!user) return
  return (
    <header className="w-full p-3  m my-6">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded-3xl p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300/50">
        <div className="flex items-center gap-5">
          {/* Profile Picture */}
          <div className="relative">
            {user?.pfp_url ? (
              <img
                src={user.pfp_url || "/placeholder.svg"}
                alt="Profile Picture"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-semibold text-gray-500">
                  {(user?.display_name || user?.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {user?.display_name || user.username || "User"}
              </h1>
              {user.display_name && user.username && (
                <p className="text-sm text-gray-500 font-medium mt-1">
                  @{user.username}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-gray-50 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  FID: {user.fid}
                </span>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">
                Active now
              </span>
            </div>
          </div>
           <button
          onClick={logoutUser}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
        </div>
      </div>
    </header>
  );
}

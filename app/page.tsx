"use client";
import UserHeader from "@/components/user-header";
import UserCast from "@/components/user-cast";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { User } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useNeynarContext();
console.log(user)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Bulk Cast Manager
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in with your Farcaster account to manage your casts
          </p>
          <div className="flex justify-center">
            <NeynarAuthButton className="bg-gray-700 p-4 cursor-pointer  rounded-md flex items-center "  />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <UserHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="pb-6">
        <UserCast user={user} />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { LogOut, Settings, ChevronDown, UserIcon } from "lucide-react";
import CustomDialog from "@/components/custom-dialog";

interface UserHeaderProps {
  user?: {
    username: string;
    display_name: string;
    pfp_url: string;
    follower_count: number;
    following_count: number;
  };
  onSignOut: () => void;
}

export default function UserHeader({ user, onSignOut }: UserHeaderProps) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="flex max-w-2xl mx-auto shadow rounded-lg my-4 items-center justify-between p-4 bg-white/80 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={user.pfp_url || "/placeholder.svg?height=40&width=40"}
            alt={user.display_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=40&width=40";
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{user.display_name}</h2>
          <div className="flex items-center">
            <p className="text-sm text-gray-500">@{user.username}</p>
            <span className="mx-1 text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              {user.follower_count.toLocaleString()} followers
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-9 px-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
        >
          <UserIcon className="h-4 w-4 text-black" />
          <span className="text-sm font-bold text-black ">Account</span>
          <ChevronDown className="h-4 w-4 text-black" />
        </button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <div className="p-3 border-b border-gray-100">
                <div className="font-medium text-gray-900">
                  {user.display_name}
                </div>
                <div className="text-xs text-gray-500">@{user.username}</div>
              </div>

              <div className="py-1">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowSignOutConfirm(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomDialog
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={() => {
          onSignOut();
          setShowSignOutConfirm(false);
        }}
        title="Sign out"
        description="Are you sure you want to sign out? You'll need to re-authenticate to access your casts again."
        confirmText="Sign out"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

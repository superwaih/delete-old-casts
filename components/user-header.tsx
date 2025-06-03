"use client";

import React from "react";

type UserHeaderProps = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
};

export default function UserHeader({ user }: UserHeaderProps) {
  return (
    <header className="w-full max-w-md mx-auto my-4 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-xl">
      {user.pfpUrl && (
        <img
          src={user.pfpUrl}
          alt="Profile Picture"
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 p-0.5 bg-white shadow-sm"
        />
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-poppins font-semibold text-indigo-900 tracking-wide">
          Welcome, {user.displayName || user.username || "User"}
        </h1>
        <div className="mt-2 text-sm text-gray-700 font-poppins space-y-1">
          <p className="font-medium text-indigo-800">FID: {user.fid}</p>
          {user.username && (
            <p className="text-gray-600">
              Username:{" "}
              <span className="font-medium text-indigo-700">
                {user.username}
              </span>
            </p>
          )}
          {user.displayName && (
            <p className="text-gray-600">
              Display Name:{" "}
              <span className="font-medium text-indigo-700">
                {user.displayName}
              </span>
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

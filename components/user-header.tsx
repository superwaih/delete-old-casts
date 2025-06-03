// components/UserHeader.tsx
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
    <header className="w-full max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6 text-center">
      {user.pfpUrl && (
        <img
          src={user.pfpUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-gray-200"
        />
      )}
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome, {user.displayName || user.username || "User"}
      </h1>
      <div className="mt-2 text-gray-600">
        <p>FID: {user.fid}</p>
        {user.username && <p>Username: {user.username}</p>}
        {user.displayName && <p>Display Name: {user.displayName}</p>}
      </div>
    </header>
  );
}

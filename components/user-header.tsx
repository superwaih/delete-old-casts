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
    <header className="w-full flex max-w-md gap-4  m-2 bg-white shadow-md rounded-xl p-2">
      {user.pfpUrl && (
        <img
          src={user?.pfpUrl}
          alt="Profile Picture"
          className="w-12 h-12 rounded-full object-cover mx-auto mb-4 border border-gray-200"
        />
      )}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user.displayName || user.username || "User"}
        </h1>
        <div className="mt-2 text-gray-600">
          <p>FID: {user.fid}</p>
          {user.username && <p>Username: {user.username}</p>}
          {user.displayName && <p>Display Name: {user.displayName}</p>}
        </div>
      </div>
    </header>
  );
}

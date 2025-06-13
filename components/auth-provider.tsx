"use client";

import type { ReactNode } from "react";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { authKitConfig } from "@/lib/authkit";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <AuthKitProvider config={authKitConfig}>{children}</AuthKitProvider>;
}

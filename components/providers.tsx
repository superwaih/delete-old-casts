"use client"

import { NeynarContextProvider, Theme } from "@neynar/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "./auth-provider"

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    return (
      <AuthProvider>
        <NeynarContextProvider
          settings={{
            clientId: "ece61cf7-b4c6-4af6-8ddd-6ffce94c3d2c",
            defaultTheme: Theme.Light,

            eventsCallbacks: {
              onAuthSuccess: () => {
                console.log("Authentication successful");
              },
              onSignout: () => {
                console.log("User signed out");
              },
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NeynarContextProvider>
      </AuthProvider>
    );
}

export default Providers
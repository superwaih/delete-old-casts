"use client"

import { NeynarContextProvider, Theme } from "@neynar/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    return (
        
                        <NeynarContextProvider
                settings={{
                  clientId: "032eef08-f408-40f5-91ff-bf0af86a8986",
                  defaultTheme: Theme.Light,
                  eventsCallbacks: {
                    onAuthSuccess: () => {},
                    onSignout() {},
                  },
                }}
              >

        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
              </NeynarContextProvider>
    )
}

export default Providers
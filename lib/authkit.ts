"use client"

// Create the AuthKit configuration
export const authKitConfig = {
  domain: typeof window !== "undefined" ? window.location.host : "",
  siweUri: typeof window !== "undefined" ? window.location.origin : "",
  relay: "https://relay.farcaster.xyz",
  version: "v1",
}

// Helper function to get the current signer from AuthKit
export const getCurrentSigner = async () => {
  try {
    if (typeof window === "undefined") return null

    // Access the AuthKit state from localStorage
    const authState = localStorage.getItem("fc_auth_kit")
    if (!authState) return null

    try {
      const parsedState = JSON.parse(authState)

      if (parsedState?.status === "authenticated" && parsedState?.session) {
        const { message, signer } = parsedState.session

        return {
          signerUuid: signer?.signerUuid,
          fid: message.fid,
          username: message.username,
          displayName: message.displayName,
          pfpUrl: message.pfpUrl,
        }
      }
    } catch (e) {
      console.error("Error parsing auth state:", e)
    }

    return null
  } catch (error) {
    console.error("Error getting auth status:", error)
    return null
  }
}

// Helper function to sign out
export const signOut = async () => {
  try {
    // Clear the AuthKit state from localStorage
    localStorage.removeItem("fc_auth_kit")
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    return false
  }
}

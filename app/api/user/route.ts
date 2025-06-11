import neynarClient from "@/lib/neynar-client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const signerUuid = searchParams.get("signer_uuid")

  if (!signerUuid) {
    return NextResponse.json({ error: "Signer UUID is required" }, { status: 400 })
  }

  try {

    const signer = await neynarClient.lookupSigner({ signerUuid })
    console.log("Signer details:", signer)

    if (signer.status !== "approved") {
      return NextResponse.json(
        {
          error: "Signer not approved",
          status: signer.status,
          signer,
        },
        { status: 400 },
      )
    }

    // Check if signer has FID
    if (!signer.fid) {
      console.error("Signer approved but no FID found:", signer)
      return NextResponse.json(
        {
          error: "Signer approved but no FID associated",
          signer,
        },
        { status: 400 },
      )
    }

    console.log("Getting user info for FID:", signer.fid)

    // Get user info using the correct method
    const userResponse = await neynarClient.fetchBulkUsers({
      fids: [signer.fid],
    })

    if (!userResponse.users || userResponse.users.length === 0) {
      return NextResponse.json(
        {
          error: "User not found for FID",
          fid: signer.fid,
        },
        { status: 404 },
      )
    }

    const user = userResponse.users[0]
    console.log("User response:", user)

    return NextResponse.json(
      {
        user: user,
        signer,
        fid: signer.fid,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in user lookup:", error)

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Lookup failed",
          details: error.message,
          signerUuid,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "An unknown error occurred",
        signerUuid,
      },
      { status: 500 },
    )
  }
}

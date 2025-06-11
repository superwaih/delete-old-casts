import neynarClient from "@/lib/neynar-client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fid = searchParams.get("fid")

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 })
  }

  try {
    // Fetch user casts from Neynar
    const casts = await neynarClient.fetchCastsForUser({
      fid: Number.parseInt(fid),
      limit: 100, // Adjust as needed
    })

    // Transform the data to match the expected format
    const messages = casts.casts.map((cast) => ({
      hash: cast.hash,
      data: {
        timestamp: new Date(cast.timestamp).getTime(),
        castAddBody: {
          text: cast.text,
          parentCastId: cast.parent_hash
            ? {
                fid: cast.parent_author?.fid || 0,
              }
            : undefined,
        },
      },
    }))

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user casts:", error)
    return NextResponse.json({ error: "Failed to fetch user casts" }, { status: 500 })
  }
}

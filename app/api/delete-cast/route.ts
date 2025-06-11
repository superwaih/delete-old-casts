import neynarClient from "@/lib/neynar-client"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  const body = await req.json()
  const { hash, signer } = body

  if (!hash || !signer) {
    return NextResponse.json({ error: "Hash and signer are required" }, { status: 400 })
  }

  try {
    // Delete the cast using Neynar
    await neynarClient.deleteCast({
      signerUuid: signer,
      targetHash: hash,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting cast:", error)
    return NextResponse.json({ error: "Failed to delete cast" }, { status: 500 })
  }
}

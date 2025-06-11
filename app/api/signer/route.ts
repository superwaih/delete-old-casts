import { getSignedKey } from "@/utils/get-signed-key"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const signedKey = await getSignedKey()
    return NextResponse.json(signedKey, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

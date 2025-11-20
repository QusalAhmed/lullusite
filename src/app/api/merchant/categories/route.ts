import { NextResponse } from "next/server"
import getCategory from "@/actions/category/get-category"

export async function GET() {
  try {
    const data = await getCategory()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 })
  }
}

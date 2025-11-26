import { NextRequest, NextResponse } from "next/server"
import getProducts from "@/actions/product/get-products"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const data = await getProducts(limit, offset)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: "Failed to fetch products", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


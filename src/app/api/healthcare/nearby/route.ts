import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location") ?? "";

  // Production: call Google Places/Maps here using a server-only API key.
  return NextResponse.json({
    location,
    facilities: []
  });
}

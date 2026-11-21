import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.TESAZMARE_API_URL || "http://localhost:5050";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    const result = NextResponse.json(data, {
      status: response.status,
    });

    // Forward the backend authentication cookie to the browser.
    const cookie = response.headers.get("set-cookie");

    if (cookie) {
      result.headers.append("Set-Cookie", cookie);
    }

    return result;
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the authentication server." },
      { status: 502 },
    );
  }
}

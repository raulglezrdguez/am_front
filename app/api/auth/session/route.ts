import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Create a session cookie (valid for 5 days)
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days in milliseconds
    });

    // Set httpOnly, secure cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
    });

    return NextResponse.json(
      { success: true, uid: decodedToken.uid },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create session" },
      { status: 401 }
    );
  }
}

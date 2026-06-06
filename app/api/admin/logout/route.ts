import { NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/admin-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

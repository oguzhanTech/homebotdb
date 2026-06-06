import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAgeSec,
  getAdminPassword,
  verifyAdminPassword,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  if (!getAdminPassword()) {
    return NextResponse.json(
      { ok: false, message: "Admin login is not configured on the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Incorrect password." },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(getAdminSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminSessionMaxAgeSec(),
  });

  return response;
}

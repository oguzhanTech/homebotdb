const SESSION_COOKIE = "hbr_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production.");
  }
  return "dev-only-insecure-admin-secret";
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bufferToBase64Url(signature);
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE;
}

export function getAdminSessionMaxAgeSec() {
  return SESSION_MAX_AGE_SEC;
}

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password || null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword() && process.env.ADMIN_SESSION_SECRET?.trim());
}

export function verifyAdminPassword(input: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return timingSafeEqualString(input, expected);
}

export async function createAdminSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payload = `admin:${expiresAt}`;
  const payloadB64 = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const signature = await hmacSign(payloadB64, getSessionSecret());
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await hmacSign(payloadB64, getSessionSecret());

  if (!timingSafeEqualString(signature, expected)) return false;

  try {
    const payload = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const [, expiresStr] = payload.split(":");
    const expiresAt = Number(expiresStr);
    return Number.isFinite(expiresAt) && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

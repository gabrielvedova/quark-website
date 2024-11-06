import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/lib/definitions";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

async function decrypt(session: string = "") {
  try {
    return (await jwtVerify(session, encodedKey, { algorithms: ["HS256"] }))
      .payload;
  } catch (error) {}
}

async function setSessionCookie(session: string, expiresAt: Date) {
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/admin",
  });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  return payload;
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  await setSessionCookie(session, expiresAt);
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000);
  await setSessionCookie(session, expiresAt);
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function getUserId() {
  return (await getSession())?.userId as string | null;
}

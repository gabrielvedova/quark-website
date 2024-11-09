import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UnauthorizedError } from "./errors";

/**
 * The secret key used to sign the session token.
 */
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

/**
 * Encrypts a session token.
 *
 * @param payload The payload to encrypt.
 *
 * @returns The encrypted session token.
 */
async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

/**
 * Decrypts a session token.
 *
 * @param session The session token to decrypt.
 *
 * @returns The decrypted payload, or null if the token is invalid.
 */
async function decrypt(session: string = "") {
  try {
    return (await jwtVerify(session, encodedKey, { algorithms: ["HS256"] }))
      .payload;
  } catch (error) {
    return null;
  }
}

/**
 * Sets the session cookie.
 *
 * @param session The session token.
 * @param expiresAt The expiration date of the session token.
 */
async function setSessionCookie(session: string, expiresAt: Date) {
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/admin",
  });
}

/**
 * Gets the current session payload from the session cookie.
 *
 * @returns The current session, or null if there is no session.
 */
export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  return payload;
}

/**
 * Creates a new session for a user.
 *
 * @param userId The ID of the user.
 */
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  await setSessionCookie(session, expiresAt);
}

/**
 * Updates the current session.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 */
export async function updateSession() {
  const userId = await getUserId();

  if (!userId) {
    throw new UnauthorizedError();
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  await setSessionCookie(session, expiresAt);
}

/**
 * Deletes the current session.
 */
export async function deleteSession() {
  (await cookies()).delete("session");
}

/**
 * Gets the ID of the current user from the session cookie.
 *
 * @returns The ID of the current user, or null if the user is not authenticated.
 */
export async function getUserId() {
  return (await getSession())?.userId as string | null;
}

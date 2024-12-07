import "server-only";
import prisma from "./prisma";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { UnauthorizedError } from "./errors";

/**
 * Clean expired sessions.
 */
async function cleanSessions() {
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  sessionId: string;
  expiresAt: Date;
};

/**
 * Encrypt a session.
 *
 * @param payload The payload to encrypt.
 *
 * @returns The encrypted session.
 */
async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

/**
 * Decrypt a session.
 *
 * @param session The session to decrypt.
 *
 * @returns The decrypted session.
 */
async function decryptSession(session: string) {
  try {
    return (await jwtVerify(session, encodedKey, { algorithms: ["HS256"] }))
      .payload;
  } catch (error) {
    return null;
  }
}

/**
 * Set the session cookie.
 *
 * @param session The session to set.
 * @param expiresAt The expiration date of the session.
 */
async function setSessionCookie(session: string, expiresAt: Date) {
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Get the session payload from the cookies.
 *
 * @returns The session payload.
 */
export async function getSessionPayload() {
  const session = (await cookies()).get("session");
  if (!session) return null;

  const jwtPayload = await decryptSession(session.value);

  if (!jwtPayload || !jwtPayload.sessionId || !jwtPayload.expiresAt) {
    return null;
  }

  return jwtPayload as SessionPayload;
}

/**
 * Check if an admin is authenticated.
 *
 * @returns Whether the admin is authenticated.
 */
export async function isAdminAuthenticated() {
  return !!(await getSession());
}

/**
 * Get the session from the cookies.
 *
 * @returns The session.
 */
export async function getSession() {
  const payload = await getSessionPayload();
  if (!payload) return null;

  await cleanSessions();
  return await prisma.session.findUnique({
    where: { id: payload.sessionId },
  });
}

/**
 * Get the ID of the authenticated admin.
 *
 * @returns The ID of the authenticated admin.
 */
export async function getAdminId() {
  const session = await getSession();
  if (!session) return null;

  return session.adminId;
}

/**
 * Create a new session.
 *
 * @param adminId The ID of the admin.
 */
export async function createSession(adminId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await cleanSessions();
  if (await isAdminAuthenticated()) await deleteSession();
  const { id } = await prisma.session.create({ data: { adminId, expiresAt } });
  console.log(await prisma.session.findMany());

  const session = await encryptSession({ sessionId: id, expiresAt });
  await setSessionCookie(session, expiresAt);
}

/**
 * Update the current session expiration date.
 */
export async function updateSession() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await cleanSessions();
  await prisma.session.update({
    where: { id: session.id },
    data: { expiresAt },
  });

  const newSessionPayload = await encryptSession({
    sessionId: session.id,
    expiresAt,
  });

  await setSessionCookie(newSessionPayload, expiresAt);
}

/**
 * Delete the current session and remove the session cookie.
 */
export async function deleteSession() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  await cleanSessions();
  await prisma.session.delete({ where: { id: session.id } });
  (await cookies()).delete("session");
}

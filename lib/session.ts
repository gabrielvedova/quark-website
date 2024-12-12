import "server-only";
import prismaClient from "./prisma";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { UnauthorizedError } from "./errors";

async function cleanSessions() {
  await prismaClient.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  sessionId: string;
  expiresAt: Date;
};

async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

async function decryptSession(session: string) {
  try {
    return (await jwtVerify(session, encodedKey, { algorithms: ["HS256"] }))
      .payload;
  } catch (error) {
    return null;
  }
}

async function setSessionCookie(session: string, expiresAt: Date) {
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSessionPayload() {
  const session = (await cookies()).get("session");
  if (!session) return null;

  const jwtPayload = await decryptSession(session.value);

  if (!jwtPayload || !jwtPayload.sessionId || !jwtPayload.expiresAt) {
    return null;
  }

  return jwtPayload as SessionPayload;
}

export async function isAdminAuthenticated() {
  return !!(await getSession());
}

export async function getSession() {
  const payload = await getSessionPayload();
  if (!payload) return null;

  await cleanSessions();
  return await prismaClient.session.findUnique({
    where: { id: payload.sessionId },
  });
}

export async function getAdminId() {
  const session = await getSession();
  if (!session) return null;

  return session.adminId;
}

export async function createSession(adminId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await cleanSessions();
  if (await isAdminAuthenticated()) await deleteSession();
  const { id } = await prismaClient.session.create({
    data: { adminId, expiresAt },
  });

  const session = await encryptSession({ sessionId: id, expiresAt });
  await setSessionCookie(session, expiresAt);
}

export async function updateSession() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await cleanSessions();
  await prismaClient.session.update({
    where: { id: session.id },
    data: { expiresAt },
  });

  const newSessionPayload = await encryptSession({
    sessionId: session.id,
    expiresAt,
  });

  await setSessionCookie(newSessionPayload, expiresAt);
}

export async function deleteSession() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  await cleanSessions();
  await prismaClient.session.delete({ where: { id: session.id } });
  (await cookies()).delete("session");
}

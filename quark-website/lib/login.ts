import prisma from "./db";
import argon2 from "argon2";
import { createSession } from "./session";
import { IncorrectEmailOrPasswordError } from "./errors";

/**
 * Log in an admin.
 *
 * @param data.email The email of the admin.
 * @param data.password The password of the admin.
 *
 * @throws {IncorrectEmailOrPasswordError} If the email or password is incorrect.
 */
export default async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new IncorrectEmailOrPasswordError();

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches) throw new IncorrectEmailOrPasswordError();

  await createSession(admin.id);
}

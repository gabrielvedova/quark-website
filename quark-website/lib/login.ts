import prisma from "./db";
import argon2 from "argon2";
import { createSession } from "./session";
import { IncorrectUsernameOrPasswordError } from "./errors";

/**
 * Log in an admin.
 *
 * @param data.username The username of the admin.
 * @param data.password The password of the admin.
 *
 * @throws {IncorrectUsernameOrPasswordError} If the email or password is incorrect.
 */
export default async function login(data: {
  username: string;
  password: string;
}) {
  const { username, password } = data;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) throw new IncorrectUsernameOrPasswordError();

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches) throw new IncorrectUsernameOrPasswordError();

  await createSession(admin.id);
}

import prisma from "./db";
import argon2 from "argon2";
import { createSession } from "./session";
import { IncorrectEmailOrPasswordError } from "./errors";

export default async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new IncorrectEmailOrPasswordError();

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches) throw new IncorrectEmailOrPasswordError();

  await createSession(admin.id);
}

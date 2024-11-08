import prisma from "./db";
import argon2 from "argon2";
import { createSession } from "./session";

export default async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new Error("Email or password incorrect");

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches) throw new Error("Email or password incorrect");

  await createSession(admin.id);
}

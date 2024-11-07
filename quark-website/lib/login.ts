import prisma from "./db";
import argon2 from "argon2";
import { createSession } from "./session";

export default async function login(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { message: "E-mail ou senha incorretos", status: 401 };

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches)
    return { message: "E-mail ou senha incorretos", status: 401 };

  // If the user was blocked from receiving recovery codes, unblock them
  await prisma.admin.update({
    where: { id: admin.id },
    data: { receivesRecoveryCodes: true },
  });

  await createSession(admin.id);

  return { message: "Login realizado com sucesso", status: 200 };
}

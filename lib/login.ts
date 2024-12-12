import prismaClient from "./prisma";
import argon2 from "argon2";
import { createSession } from "./session";
import { IncorrectUsernameOrPasswordError } from "./errors";

export default async function login(data: {
  username: string;
  password: string;
}) {
  const { username, password } = data;

  const admin = await prismaClient.admin.findUnique({ where: { username } });
  if (!admin) throw new IncorrectUsernameOrPasswordError();

  const passwordMatches = argon2.verify(admin.password, password);
  if (!passwordMatches) throw new IncorrectUsernameOrPasswordError();

  await createSession(admin.id);
}

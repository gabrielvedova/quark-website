import argon2 from "argon2";
import prisma from "./db";
import { getUserId } from "./session";
import {
  IncorrectPasswordError,
  NotFoundError,
  PasswordMismatchError,
  UnauthorizedError,
} from "./errors";

export async function updatePassword(data: {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  const { password, newPassword, newPasswordConfirmation } = data;

  const id = await getUserId();
  if (!id) throw new UnauthorizedError();

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  const passwordMatches = await argon2.verify(user.password, password);
  if (!passwordMatches) throw new IncorrectPasswordError();

  if (newPassword !== newPasswordConfirmation)
    throw new PasswordMismatchError();

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.admin.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

import prismaClient from "./prisma";
import {
  UsernameInUseError,
  UsernameMismatchError,
  IncorrectPasswordError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";
import argon2 from "argon2";

export async function updateUsername(data: {
  password: string;
  newUsername: string;
  newUsernameConfirmation: string;
}) {
  const { password, newUsername, newUsernameConfirmation } = data;

  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const user = await prismaClient.admin.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  if (!(await argon2.verify(user.password, password)))
    throw new IncorrectPasswordError();
  if (newUsername !== newUsernameConfirmation)
    throw new UsernameMismatchError();
  if (await prismaClient.admin.findUnique({ where: { username: newUsername } }))
    throw new UsernameInUseError();

  await prismaClient.admin.update({
    where: { id },
    data: { username: newUsername },
  });
}

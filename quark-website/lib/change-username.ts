import prisma from "./db";
import {
  UsernameInUseError,
  UsernameMismatchError,
  IncorrectPasswordError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";
import argon2 from "argon2";

/**
 * Update the email of the current user.
 *
 * @param data.password The current password of the user.
 * @param data.newUsername The new username of the user.
 * @param data.newUsernameConfirmation The new username of the user, confirmed.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 * @throws {NotFoundError} If the user is not found.
 * @throws {IncorrectPasswordError} If the password is incorrect.
 * @throws {UsernameMismatchError} If the new username and the confirmation do not match.
 * @throws {UsernameInUseError} If the new username is already in use.
 */
export async function updateUsername(data: {
  password: string;
  newUsername: string;
  newUsernameConfirmation: string;
}) {
  const { password, newUsername, newUsernameConfirmation } = data;

  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  if (!(await argon2.verify(user.password, password)))
    throw new IncorrectPasswordError();
  if (newUsername !== newUsernameConfirmation)
    throw new UsernameMismatchError();
  if (await prisma.admin.findUnique({ where: { username: newUsername } }))
    throw new UsernameInUseError();

  await prisma.admin.update({ where: { id }, data: { username: newUsername } });
}

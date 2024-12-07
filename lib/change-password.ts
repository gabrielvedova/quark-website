import argon2 from "argon2";
import prisma from "./prisma";
import {
  IncorrectPasswordError,
  NotFoundError,
  PasswordMismatchError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";

/**
 * Update the password of the current user.
 *
 * @param data.password The current password of the user.
 * @param data.newPassword The new password of the user.
 * @param data.newPasswordConfirmation The new password of the user, confirmed.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 * @throws {NotFoundError} If the user is not found.
 * @throws {IncorrectPasswordError} If the current password is incorrect.
 * @throws {PasswordMismatchError} If the new password and the confirmation do not match.
 */
export async function updatePassword(data: {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  const { password, newPassword, newPasswordConfirmation } = data;

  const id = await getAdminId();
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

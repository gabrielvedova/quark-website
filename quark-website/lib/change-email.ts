import prisma from "./db";
import {
  EmailInUseError,
  EmailMismatchError,
  IncorrectEmailError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";

/**
 * Update the email of the current user.
 *
 * @param data.email The current email of the user.
 * @param data.newEmail The new email of the user.
 * @param data.newEmailConfirmation The new email of the user, confirmed.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 * @throws {NotFoundError} If the user is not found.
 * @throws {IncorrectEmailError} If the current email is incorrect.
 * @throws {EmailMismatchError} If the new email and the confirmation do not match.
 * @throws {EmailInUseError} If the new email is already in use.
 */
export async function updateEmail(data: {
  email: string;
  newEmail: string;
  newEmailConfirmation: string;
}) {
  const { email, newEmail, newEmailConfirmation } = data;

  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  if (email !== user.email) throw new IncorrectEmailError();
  if (newEmail !== newEmailConfirmation) throw new EmailMismatchError();
  if (await prisma.admin.findUnique({ where: { email: newEmail } }))
    throw new EmailInUseError();

  await prisma.admin.update({ where: { id }, data: { email: newEmail } });
}

import prisma from "./db";
import {
  EmailInUseError,
  EmailMismatchError,
  IncorrectEmailError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getUserId } from "./session";

export async function updateEmail(data: {
  email: string;
  newEmail: string;
  newEmailConfirmation: string;
}) {
  const { email, newEmail, newEmailConfirmation } = data;

  const id = await getUserId();
  if (!id) throw new UnauthorizedError();

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new NotFoundError();

  if (email !== user.email) throw new IncorrectEmailError();
  if (newEmail !== newEmailConfirmation) throw new EmailMismatchError();
  if (await prisma.admin.findUnique({ where: { email: newEmail } }))
    throw new EmailInUseError();

  await prisma.admin.update({ where: { id }, data: { email: newEmail } });
}

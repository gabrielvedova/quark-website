import prisma from "./db";
import { UnauthorizedError } from "./errors";
import { deleteSession, getUserId } from "./session";

/**
 * Delete the current user account.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 */
export default async function deleteAccount() {
  const id = await getUserId();

  if (!id) throw new UnauthorizedError();

  await prisma.admin.delete({ where: { id } });
  await deleteSession();
}

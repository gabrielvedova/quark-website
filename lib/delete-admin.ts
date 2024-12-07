import prisma from "./prisma";
import { UnauthorizedError } from "./errors";
import { deleteSession, getAdminId } from "./session";

/**
 * Delete the current user account.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 */
export default async function deleteAccount() {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  await deleteSession();
  await prisma.admin.delete({ where: { id } });
}

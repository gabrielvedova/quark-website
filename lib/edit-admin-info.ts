import prisma from "./prisma";
import { NotFoundError, UnauthorizedError } from "./errors";
import { getAdminId } from "./session";

/**
 * Update the information of the current admin.
 *
 * @param data.name The name of the admin.
 * @param data.role The role of the admin.
 * @param data.profilePicture The profile picture of the admin.
 *
 * @throws {UnauthorizedError} If the admin is not authenticated.
 * @throws {NotFoundError} If the admin is not found.
 */
export async function updateAdminInfo(data: {
  name?: string;
  role?: string;
  profilePicture?: string;
}) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new NotFoundError();

  if (!data.name && !data.role && !data.profilePicture) {
    return;
  }

  await prisma.admin.update({ where: { id }, data });
}

import prisma from "./db";
import { NotFoundError, UnauthorizedError } from "./errors";
import { getUserId } from "./session";

export async function updateAdminInfo(data: {
  name?: string;
  role?: string;
  profilePicture?: string;
}) {
  const id = await getUserId();
  if (!id) throw new UnauthorizedError();

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new NotFoundError();

  if (!data.name && !data.role && !data.profilePicture) {
    return;
  }

  await prisma.admin.update({ where: { id }, data });
}

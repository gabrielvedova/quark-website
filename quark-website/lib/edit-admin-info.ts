import prisma from "./db";
import { getUserId } from "./session";

export async function updateAdminInfo(data: {
  name?: string;
  role?: string;
  profilePicture?: string;
}) {
  const id = await getUserId();
  if (!id) throw new Error("Unauthorized");

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new Error("Not found");

  if (!data.name && !data.role && !data.profilePicture) {
    return;
  }

  await prisma.admin.update({ where: { id }, data });
}

import prisma from "./db";

export async function updateAdminInfo(data: {
  id: string;
  name?: string;
  role?: string;
  profilePicture?: string;
}) {
  const admin = await prisma.admin.findUnique({ where: { id: data.id } });
  if (!admin) throw new Error("Not found");

  if (!data.name && !data.role && !data.profilePicture) {
    return;
  }

  await prisma.admin.update({ where: { id: data.id }, data });
}

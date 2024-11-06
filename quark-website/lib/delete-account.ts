import prisma from "./db";
import { deleteSession, getUserId } from "./session";

export default async function deleteAccount() {
  const id = await getUserId();
  if (!id) return { status: 401 };
  await prisma.admin.delete({ where: { id } });
  await deleteSession();
  return { status: 204 };
}

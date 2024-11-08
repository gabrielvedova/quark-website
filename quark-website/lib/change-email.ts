import prisma from "./db";
import { getUserId } from "./session";

export async function updateEmail(data: {
  email: string;
  newEmail: string;
  newEmailConfirmation: string;
}) {
  const { email, newEmail, newEmailConfirmation } = data;

  const id = await getUserId();
  if (!id) throw new Error("Unauthorized");

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new Error("Not found");

  if (email !== user.email) throw new Error("Current email is incorrect");
  if (newEmail !== newEmailConfirmation) throw new Error("Emails do not match");
  if (await prisma.admin.findUnique({ where: { email: newEmail } }))
    throw new Error("Email already in use");

  await prisma.admin.update({ where: { id }, data: { email: newEmail } });
}

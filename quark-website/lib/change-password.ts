import argon2 from "argon2";
import prisma from "./db";
import { getUserId } from "./session";

export async function updatePassword(data: {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  const { password, newPassword, newPasswordConfirmation } = data;

  const id = await getUserId();
  if (!id) throw new Error("Unauthorized");

  const user = await prisma.admin.findUnique({ where: { id } });
  if (!user) throw new Error("Not found");

  const passwordMatches = await argon2.verify(user.password, password);
  if (!passwordMatches) throw new Error("Current password is incorrect");

  if (newPassword !== newPasswordConfirmation)
    throw new Error("Passwords do not match");

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.admin.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

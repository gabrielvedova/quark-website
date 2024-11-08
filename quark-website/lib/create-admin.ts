import prisma from "./db";
import argon2 from "argon2";

export default async function createAdmin(data: {
  name: string;
  role: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  const { name, role, email, password, passwordConfirmation } = data;

  if (password !== passwordConfirmation)
    throw new Error("Passwords do not match");

  const emailAlreadyInUse =
    (await prisma.admin.count({ where: { email } })) !== 0;

  if (emailAlreadyInUse) throw new Error("Email already in use");

  const hashedPassword = await argon2.hash(password);

  const { id } = await prisma.admin.create({
    data: {
      name,
      role,
      email,
      password: hashedPassword,
    },
  });

  if (!id) throw new Error("Internal server error");
}

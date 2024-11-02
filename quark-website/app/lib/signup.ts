import prisma from "./db";
import argon2 from "argon2";

export default async function signup(
  name: string,
  role: string,
  email: string,
  password: string
) {
  const emailAlreadyInUse =
    (await prisma.admin.count({ where: { email } })) !== 0;

  if (emailAlreadyInUse) return { error: { email: ["E-mail já cadastrado"] } };

  const hashedPassword = await argon2.hash(password);

  const { id } = await prisma.admin.create({
    data: {
      name,
      role,
      email,
      password: hashedPassword,
    },
  });

  if (!id) return { message: "Erro ao criar usuário", status: 500 };
  return { message: "Usuário criado com sucesso", status: 200 };
}

import prisma from "./db";
import argon2 from "argon2";
import { EmailInUseError, PasswordMismatchError } from "./errors";

/**
 * Create a new admin account.
 *
 * @param data.name The name of the admin.
 * @param data.role The role of the admin.
 * @param data.email The email of the admin.
 * @param data.password The password of the admin.
 * @param data.passwordConfirmation The password of the admin, confirmed.
 *
 * @throws {PasswordMismatchError} If the password and the confirmation do not match.
 * @throws {EmailInUseError} If the email is already in use.
 * @throws {Error} If the admin could not be created.
 */
export default async function createAdmin(data: {
  name: string;
  role: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  const { name, role, email, password, passwordConfirmation } = data;

  if (password !== passwordConfirmation) throw new PasswordMismatchError();

  const emailAlreadyInUse =
    (await prisma.admin.count({ where: { email } })) !== 0;

  if (emailAlreadyInUse) throw new EmailInUseError();

  const hashedPassword = await argon2.hash(password);

  const { id } = await prisma.admin.create({
    data: {
      name,
      role,
      email,
      password: hashedPassword,
    },
  });

  if (!id) throw new Error();
}

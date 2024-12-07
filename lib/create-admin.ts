import prisma from "./prisma";
import argon2 from "argon2";
import { UsernameInUseError, PasswordMismatchError } from "./errors";

/**
 * Create a new admin account.
 *
 * @param data.name The name of the admin.
 * @param data.role The role of the admin.
 * @param data.username The username of the admin.
 * @param data.password The password of the admin.
 * @param data.passwordConfirmation The password of the admin, confirmed.
 *
 * @throws {PasswordMismatchError} If the password and the confirmation do not match.
 * @throws {UsernameInUseError} If the username is already in use.
 * @throws {Error} If the admin could not be created.
 */
export default async function createAdmin(data: {
  name: string;
  role: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}) {
  const { name, role, username, password, passwordConfirmation } = data;

  if (password !== passwordConfirmation) throw new PasswordMismatchError();

  if (await prisma.admin.findUnique({ where: { username } }))
    throw new UsernameInUseError();

  const hashedPassword = await argon2.hash(password);

  const { id } = await prisma.admin.create({
    data: {
      name,
      role,
      username,
      password: hashedPassword,
    },
  });

  if (!id) throw new Error();
}

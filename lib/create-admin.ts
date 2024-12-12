import prismaClient from "./prisma";
import argon2 from "argon2";
import {
  UsernameInUseError,
  PasswordMismatchError,
  FileUploadError,
  UnauthorizedError,
} from "./errors";
import { generateUniqueFilename } from "./utils";
import { cookies } from "next/headers";

async function uploadProfilePicture(
  profilePictureFile: string,
  requestMetadata: { origin: string }
) {
  const profilePictureKey = generateUniqueFilename();

  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.IMAGE_API_SECRET}`,
    },
    body: JSON.stringify({
      key: profilePictureKey,
      file: profilePictureFile,
    }),
  });

  if (response.status === 500) {
    const { message } = (await response.json()) as { message: string };
    throw new FileUploadError(message);
  }

  if (!response.ok) throw new Error();

  return profilePictureKey;
}

export default async function createAdmin(
  data: {
    name: string;
    role: string;
    username: string;
    password: string;
    passwordConfirmation: string;
    profilePictureFile?: string;
  },
  requestMetadata: { origin: string }
) {
  const { name, role, username, password, passwordConfirmation } = data;

  if (password !== passwordConfirmation) throw new PasswordMismatchError();

  if (await prismaClient.admin.findUnique({ where: { username } }))
    throw new UsernameInUseError();

  const hashedPassword = await argon2.hash(password);

  let profilePictureKey: string | undefined;

  if (data.profilePictureFile) {
    profilePictureKey = await uploadProfilePicture(
      data.profilePictureFile,
      requestMetadata
    );
  }

  const { id } = await prismaClient.admin.create({
    data: {
      name,
      role,
      username,
      password: hashedPassword,
      profilePictureKey,
    },
  });

  if (!id) throw new Error();
}

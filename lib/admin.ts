import prismaClient from "./prisma";
import argon2 from "argon2";
import {
  UsernameInUseError,
  PasswordMismatchError,
  FileUploadError,
  FileDeletionError,
  FileNotFoundError,
  UnauthorizedError,
  NotFoundError,
} from "./errors";
import { generateUniqueFilename } from "./utils";
import { cookies } from "next/headers";
import { deleteSession, getAdminId } from "./session";

async function fetchProfilePicture(
  adminWithImageKey: {
    id: string;
    name: string;
    role: string;
    profilePictureKey: string;
  },
  requestMetadata: { origin: string }
) {
  const response = await fetch(
    `${requestMetadata.origin}/api/images?key=${adminWithImageKey.profilePictureKey}`
  );

  if (response.status === 404) {
    throw new FileNotFoundError("Foto de perfil não encontrada");
  }

  if (!response.ok) throw new Error();

  const url = ((await response.json()) as { data: { url: string } }).data.url;

  return {
    id: adminWithImageKey.id,
    name: adminWithImageKey.name,
    role: adminWithImageKey.role,
    profilePictureUrl: url,
  };
}

export async function getAdminInfo(requestMetadata: { origin: string }) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const adminWithImageKey = await prismaClient.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      profilePictureKey: true,
    },
  });

  if (!adminWithImageKey) throw new NotFoundError();

  const adminWithImageUrl = await fetchProfilePicture(
    adminWithImageKey,
    requestMetadata
  );

  return adminWithImageUrl;
}

async function uploadProfilePicture(
  profilePictureFile: string,
  requestMetadata: { origin: string }
) {
  const profilePictureKey = generateUniqueFilename();

  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
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

export async function createAdmin(
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

  if (
    await prismaClient.admin.findUnique({
      where: { username },
      select: { id: true },
    })
  )
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

async function changeProfilePicture(
  oldProfilePictureKey: string,
  newProfilePictureFile: string,
  requestMetadata: { origin: string }
) {
  if (oldProfilePictureKey !== "no-profile-picture") {
    const deletionResponse = await fetch(
      `${requestMetadata.origin}/api/images`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await cookies()).toString(),
        },
        body: JSON.stringify({
          key: oldProfilePictureKey,
        }),
      }
    );

    if (deletionResponse.status === 404) throw new FileNotFoundError();

    if (deletionResponse.status === 500) {
      const { message } = (await deletionResponse.json()) as {
        message: string;
      };
      throw new FileDeletionError(message);
    }

    if (!deletionResponse.ok) throw new Error();
  }

  const newProfilePictureKey = generateUniqueFilename();

  const uploadResponse = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({
      key: newProfilePictureKey,
      file: newProfilePictureFile,
    }),
  });

  if (uploadResponse.status === 500) {
    const { message } = (await uploadResponse.json()) as { message: string };
    throw new FileUploadError(message);
  }

  if (!uploadResponse.ok) throw new Error();

  return newProfilePictureKey;
}

export async function updateAdminInfo(
  data: {
    name?: string;
    role?: string;
    profilePictureFile?: string;
  },
  requestMetadata: { origin: string }
) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const admin = await prismaClient.admin.findUnique({
    where: { id },
    select: { profilePictureKey: true },
  });
  if (!admin) throw new NotFoundError();

  if (!data.name && !data.role && !data.profilePictureFile) {
    return;
  }

  let profilePictureKey: string | undefined;

  if (data.profilePictureFile) {
    profilePictureKey = await changeProfilePicture(
      admin.profilePictureKey,
      data.profilePictureFile,
      requestMetadata
    );
  }

  await prismaClient.admin.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      profilePictureKey,
    },
  });
}

async function deleteProfilePicture(
  profilePictureKey: string,
  requestMetadata: { origin: string }
) {
  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({
      key: profilePictureKey,
    }),
  });

  if (response.status === 404) throw new FileNotFoundError();

  if (response.status === 500) {
    const { message } = (await response.json()) as { message: string };
    throw new FileDeletionError(message);
  }

  if (!response.ok) throw new Error();
}

export async function deleteAccount(requestMetadata: { origin: string }) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  await deleteSession();
  const { profilePictureKey } = await prismaClient.admin.delete({
    where: { id },
    select: { profilePictureKey: true },
  });

  if (profilePictureKey !== "no-profile-picture") {
    await deleteProfilePicture(profilePictureKey, requestMetadata);
  }
}

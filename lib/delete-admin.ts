import prismaClient from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  UnauthorizedError,
} from "./errors";
import { deleteSession, getAdminId } from "./session";
import { cookies } from "next/headers";

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

export default async function deleteAccount(requestMetadata: {
  origin: string;
}) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  await deleteSession();
  const { profilePictureKey } = await prismaClient.admin.delete({
    where: { id },
  });

  if (profilePictureKey !== "no-profile-picture") {
    await deleteProfilePicture(profilePictureKey, requestMetadata);
  }
}

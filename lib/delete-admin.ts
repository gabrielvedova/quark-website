import prisma from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  UnauthorizedError,
} from "./errors";
import { deleteSession, getAdminId } from "./session";

async function deleteProfilePicture(profilePictureKey: string) {
  const response = await fetch("/api/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
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

/**
 * Delete the current user account.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 */
export default async function deleteAccount() {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  await deleteSession();
  const { profilePictureKey } = await prisma.admin.delete({ where: { id } });

  if (profilePictureKey !== "no-profile-picture") {
    await deleteProfilePicture(profilePictureKey);
  }
}

import prisma from "./prisma";
import {
  FileDeletionError,
  NotFoundError,
  UnauthorizedError,
  FileUploadError,
  FileNotFoundError,
} from "./errors";
import { getAdminId } from "./session";
import { generateUniqueFilename } from "./utils";

async function changeProfilePicture(
  oldProfilePictureKey: string,
  newProfilePictureFile: string
) {
  if (oldProfilePictureKey !== "no-profile-picture") {
    const deletionResponse = await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: oldProfilePictureKey,
      }),
    });

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

  const uploadResponse = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

/**
 * Update the information of the current admin.
 *
 * @param data.name The name of the admin.
 * @param data.role The role of the admin.
 * @param data.profilePicture The profile picture of the admin.
 *
 * @throws {UnauthorizedError} If the admin is not authenticated.
 * @throws {NotFoundError} If the admin is not found.
 */
export async function updateAdminInfo(data: {
  name?: string;
  role?: string;
  profilePictureFile?: string;
}) {
  const id = await getAdminId();
  if (!id) throw new UnauthorizedError();

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new NotFoundError();

  if (!data.name && !data.role && !data.profilePictureFile) {
    return;
  }

  let profilePictureKey: string | undefined;

  if (data.profilePictureFile) {
    profilePictureKey = await changeProfilePicture(
      admin.profilePictureKey,
      data.profilePictureFile
    );
  }

  await prisma.admin.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      profilePictureKey,
    },
  });
}

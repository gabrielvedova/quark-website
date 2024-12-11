import prisma from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
} from "./errors";
import { generateUniqueFilename } from "./utils";

async function fetchRequiredImages(headlineWithImageKey: {
  id: number;
  title: string;
  description: string;
  miniatureKey: string;
  publishingDate: Date;
  url: string;
}) {
  const response = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: headlineWithImageKey.miniatureKey }),
  });

  if (response.status === 404) {
    throw new FileNotFoundError();
  }

  if (!response.ok) throw new Error();

  const headlineMiniatureUrl = (
    (await response.json()) as {
      data: { url: string };
    }
  ).data.url;

  return {
    id: headlineWithImageKey.id,
    title: headlineWithImageKey.title,
    description: headlineWithImageKey.description,
    miniatureUrl: headlineMiniatureUrl,
    publishingDate: headlineWithImageKey.publishingDate,
    url: headlineWithImageKey.url,
  };
}

/**
 * Get all headlines or a specific headline.
 *
 * @param params.id The id of the headline.
 *
 * @returns The headline(s).
 */
export async function getHeadline(params: { id?: number }) {
  if (params.id) {
    const headlineWithImageKey = await prisma.headline.findUnique({
      where: { id: params.id },
    });

    if (!headlineWithImageKey) return [];

    const headlineWithImageUrl = await fetchRequiredImages(
      headlineWithImageKey
    );

    return [headlineWithImageUrl];
  }
  const headlinesWithImageKey = await prisma.headline.findMany();

  const headlinesWithImageUrl = await Promise.all(
    headlinesWithImageKey.map(fetchRequiredImages)
  );

  return headlinesWithImageUrl;
}

async function uploadNewMiniature(miniatureFile: string) {
  const miniatureKey = generateUniqueFilename();

  const response = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: miniatureKey, file: miniatureFile }),
  });

  if (!response.ok) throw new FileUploadError();

  return miniatureKey;
}

/**
 * Create a new headline.
 *
 * @param data.title The title of the headline.
 * @param data.description The description of the headline.
 * @param data.miniature The miniature of the headline.
 * @param data.publishingDate The publishing date of the headline.
 * @param data.url The URL of the headline.
 *
 * @returns The ID of the new headline.
 */
export async function createHeadline(data: {
  title: string;
  description: string;
  miniatureFile: string;
  publishingDate: string;
  url: string;
}) {
  data.publishingDate = new Date(data.publishingDate).toISOString();
  const miniatureKey = await uploadNewMiniature(data.miniatureFile);

  const { id } = await prisma.headline.create({
    data: {
      title: data.title,
      description: data.description,
      miniatureKey,
      publishingDate: data.publishingDate,
      url: data.url,
    },
  });

  return id;
}

async function updateMiniature(
  oldMiniatureKey: string,
  newMiniatureFile: string
) {
  const deleteResponse = await fetch("/api/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: oldMiniatureKey }),
  });

  if (deleteResponse.status === 404) throw new FileNotFoundError();
  if (!deleteResponse.ok) throw new FileDeletionError();

  const newMiniatureKey = generateUniqueFilename();

  const uploadResponse = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: newMiniatureKey, file: newMiniatureFile }),
  });

  if (!uploadResponse.ok) throw new FileUploadError();

  return newMiniatureKey;
}

/**
 * Update a headline.
 *
 * @param data.id The ID of the headline to update.
 * @param data.title The new title of the headline.
 * @param data.description The new description of the headline.
 * @param data.miniature The new miniature of the headline.
 * @param data.publishingDate The new publishing date of the headline.
 * @param data.url The new URL of the headline.
 *
 * @throws {NotFoundError} If the headline is not found.
 */
export async function updateHeadline(data: {
  id: number;
  title?: string;
  description?: string;
  miniatureFile?: string;
  publishingDate?: string;
  url?: string;
}) {
  const headline = await prisma.headline.findUnique({ where: { id: data.id } });
  if (!headline) throw new NotFoundError();

  if (
    !data.title &&
    !data.description &&
    !data.miniatureFile &&
    !data.publishingDate &&
    !data.url
  ) {
    return;
  }

  let miniatureKey: string | undefined;

  if (data.miniatureFile) {
    miniatureKey = await updateMiniature(
      headline.miniatureKey,
      data.miniatureFile
    );
  }

  await prisma.headline.update({ where: { id: data.id }, data });
}

async function deleteMiniature(miniatureKey: string) {
  const response = await fetch("/api/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: miniatureKey }),
  });

  if (response.status === 404) throw new FileNotFoundError();
  if (!response.ok) throw new FileDeletionError();
}

/**
 * Delete a headline.
 *
 * @param data.id The ID of the headline to delete.
 *
 * @throws {NotFoundError} If the headline is not found.
 */
export async function deleteHeadline(data: { id: number }) {
  const headline = await prisma.headline.findUnique({ where: { id: data.id } });
  if (!headline) throw new NotFoundError();

  await prisma.headline.delete({ where: { id: data.id } });
  deleteMiniature(headline.miniatureKey);
}

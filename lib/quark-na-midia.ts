import prismaClient from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { generateUniqueFilename } from "./utils";
import { cookies } from "next/headers";

async function fetchRequiredImages(
  headlineWithImageKey: {
    id: number;
    title: string;
    description: string;
    miniatureKey: string;
    publishingDate: Date;
    url: string;
  },
  requestMetadata: { origin: string }
) {
  const response = await fetch(
    `${requestMetadata.origin}/api/images?key=${headlineWithImageKey.miniatureKey}`
  );

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

export async function getHeadline(
  params: { id?: number },
  requestMetadata: { origin: string }
) {
  if (params.id) {
    const headlineWithImageKey = await prismaClient.headline.findUnique({
      where: { id: params.id },
    });

    if (!headlineWithImageKey) return [];

    const headlineWithImageUrl = await fetchRequiredImages(
      headlineWithImageKey,
      requestMetadata
    );

    return [headlineWithImageUrl];
  }
  const headlinesWithImageKey = await prismaClient.headline.findMany();

  const headlinesWithImageUrl = await Promise.all(
    headlinesWithImageKey.map((headlineWithImageKey) => {
      return fetchRequiredImages(headlineWithImageKey, requestMetadata);
    })
  );

  return headlinesWithImageUrl;
}

async function uploadNewMiniature(
  miniatureFile: string,
  requestMetadata: { origin: string }
) {
  const miniatureKey = generateUniqueFilename();

  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key: miniatureKey, file: miniatureFile }),
  });

  if (!response.ok) throw new FileUploadError();

  return miniatureKey;
}

export async function createHeadline(
  data: {
    title: string;
    description: string;
    miniatureFile: string;
    publishingDate: string;
    url: string;
  },
  requestMetadata: { origin: string }
) {
  data.publishingDate = new Date(data.publishingDate).toISOString();
  const miniatureKey = await uploadNewMiniature(
    data.miniatureFile,
    requestMetadata
  );

  const { id } = await prismaClient.headline.create({
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
  newMiniatureFile: string,
  requestMetadata: { origin: string }
) {
  const deleteResponse = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key: oldMiniatureKey }),
  });

  if (deleteResponse.status === 404) throw new FileNotFoundError();
  if (!deleteResponse.ok) throw new FileDeletionError();

  const newMiniatureKey = generateUniqueFilename();

  const uploadResponse = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key: newMiniatureKey, file: newMiniatureFile }),
  });

  if (!uploadResponse.ok) throw new FileUploadError();

  return newMiniatureKey;
}

export async function updateHeadline(
  data: {
    id: number;
    title?: string;
    description?: string;
    miniatureFile?: string;
    publishingDate?: string;
    url?: string;
  },
  requestMetadata: { origin: string }
) {
  const headline = await prismaClient.headline.findUnique({
    where: { id: data.id },
  });
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
      data.miniatureFile,
      requestMetadata
    );
  }

  await prismaClient.headline.update({ where: { id: data.id }, data });
}

async function deleteMiniature(
  miniatureKey: string,
  requestMetadata: { origin: string }
) {
  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key: miniatureKey }),
  });

  if (response.status === 404) throw new FileNotFoundError();
  if (!response.ok) throw new FileDeletionError();
}

export async function deleteHeadline(
  data: { id: number },
  requestMetadata: { origin: string }
) {
  const headline = await prismaClient.headline.findUnique({
    where: { id: data.id },
  });
  if (!headline) throw new NotFoundError();

  await prismaClient.headline.delete({ where: { id: data.id } });
  deleteMiniature(headline.miniatureKey, requestMetadata);
}

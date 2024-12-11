import prisma from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";
import { generateUniqueFilename } from "./utils";

async function fetchRequiredImages(
  postWithImageKeys: {
    author: {
      id: string;
      name: string;
      role: string;
      profilePictureKey: string;
    };
  } & {
    id: number;
    title: string;
    content: string;
    miniatureKey: string;
    authorId: string;
    published: boolean;
    lastEditedAt: Date;
  }
) {
  const postMiniatureResponse = await fetch("/api/images", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.IMAGE_API_KEY}`,
    },
    body: JSON.stringify({ key: postWithImageKeys.miniatureKey }),
  });

  if (postMiniatureResponse.status === 404)
    throw new FileNotFoundError("Miniatura do post não encontrada");

  if (!postMiniatureResponse.ok) throw new Error();

  const postMiniatureUrl = (
    (await postMiniatureResponse.json()) as {
      data: { url: string };
    }
  ).data.url;

  const authorProfilePictureResponse = await fetch("/api/images", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.IMAGE_API_KEY}`,
    },
    body: JSON.stringify({ key: postWithImageKeys.author.profilePictureKey }),
  });

  if (authorProfilePictureResponse.status === 404)
    throw new FileNotFoundError("Foto de perfil do autor não encontrada");

  if (!authorProfilePictureResponse.ok) throw new Error();

  const authorProfilePictureUrl = (
    (await authorProfilePictureResponse.json()) as {
      data: { url: string };
    }
  ).data.url;

  return {
    id: postWithImageKeys.id,
    title: postWithImageKeys.title,
    content: postWithImageKeys.content,
    miniatureUrl: postMiniatureUrl,
    authorId: postWithImageKeys.authorId,
    author: {
      id: postWithImageKeys.author.id,
      name: postWithImageKeys.author.name,
      role: postWithImageKeys.author.role,
      profilePictureUrl: authorProfilePictureUrl,
    },
    published: postWithImageKeys.published,
    lastEditedAt: postWithImageKeys.lastEditedAt,
  };
}

/**
 * Get a filtered or unfiltered list of posts.
 *
 * @param params.id The ID of the post to retrieve.
 * @param params.search The search query to filter posts by.
 * @param params.published Filter posts by their published status.
 *
 * @returns The list of posts that match the search query.
 */
export async function getPosts(params: {
  id?: number;
  search?: string;
  published?: boolean;
}) {
  if (params.id) {
    const postWithImageKeys = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            profilePictureKey: true,
          },
        },
      },
    });

    if (!postWithImageKeys) return [];

    const postWithImageUrls = await fetchRequiredImages(postWithImageKeys);
    return [postWithImageUrls];
  }

  let postsWithImageKeys = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: params?.search || "", mode: "insensitive" } },
        { content: { contains: params?.search || "", mode: "insensitive" } },
        {
          author: {
            OR: [
              { name: { contains: params?.search || "", mode: "insensitive" } },
              { role: { contains: params?.search || "", mode: "insensitive" } },
            ],
          },
        },
      ],
    },
    orderBy: {
      lastEditedAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profilePictureKey: true,
        },
      },
    },
  });

  if (params.published) {
    postsWithImageKeys = postsWithImageKeys.filter(
      (post) => post.published === params.published
    );
  }

  const postsWithImageUrls = await Promise.all(
    postsWithImageKeys.map(fetchRequiredImages)
  );

  return postsWithImageUrls;
}

async function uploadNewMiniature(miniatureFile: string) {
  const miniatureKey = generateUniqueFilename();

  const response = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: miniatureKey, data: miniatureFile }),
  });

  if (!response.ok) throw new FileUploadError();

  return miniatureKey;
}

/**
 * Create a new post.
 *
 * @param data.title The title of the post.
 * @param data.content The content of the post.
 * @param data.miniature The miniature of the post.
 * @param data.published The published status of the post.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 *
 * @returns The ID of the created post.
 */
export async function createPost(data: {
  title: string;
  content: string;
  miniatureFile: string;
  published: boolean;
}) {
  const adminId = await getAdminId();

  if (!adminId) throw new UnauthorizedError();

  const miniatureKey = await uploadNewMiniature(data.miniatureFile);

  const { id } = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      miniatureKey,
      published: data.published,
      authorId: adminId,
      lastEditedAt: new Date(),
    },
  });

  return id;
}

async function updateMiniature(
  oldMiniatureKey: string,
  newMiniatureFile: string
) {
  const deletionResponse = await fetch("/api/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: oldMiniatureKey }),
  });

  if (deletionResponse.status === 404) throw new FileNotFoundError();
  if (!deletionResponse.ok) throw new FileDeletionError();

  const newMiniatureKey = generateUniqueFilename();

  const uploadResponse = await fetch("/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: newMiniatureKey, data: newMiniatureFile }),
  });

  if (!uploadResponse.ok) throw new FileUploadError();

  return newMiniatureKey;
}

/**
 * Update a post.
 *
 * @param data.id The ID of the post to update.
 * @param data.title The new title of the post.
 * @param data.content The new content of the post.
 * @param data.miniature The new miniature of the post.
 * @param data.published The new published status of the post.
 *
 * @throws {NotFoundError} If the post is not found.
 */
export async function updatePost(data: {
  id: number;
  title?: string;
  content?: string;
  miniatureFile?: string;
  published?: boolean;
}) {
  const post = await prisma.post.findUnique({ where: { id: data.id } });
  if (!post) throw new NotFoundError();

  if (
    !data.title &&
    !data.content &&
    !data.miniatureFile &&
    data.published === undefined
  ) {
    return;
  }

  let miniatureKey: string | undefined;

  if (data.miniatureFile) {
    miniatureKey = await updateMiniature(post.miniatureKey, data.miniatureFile);
  }

  await prisma.post.update({
    where: { id: data.id },
    data: {
      title: data.title,
      content: data.content,
      miniatureKey,
      published: data.published,
      lastEditedAt: new Date(),
    },
  });
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
 * Delete a post.
 *
 * @param data.id The ID of the post to delete.
 *
 * @throws {NotFoundError} If the post is not found.
 */
export async function deletePost(data: { id: number }) {
  const post = await prisma.post.findUnique({ where: { id: data.id } });
  if (!post) throw new NotFoundError();

  const { miniatureKey } = await prisma.post.delete({ where: { id: data.id } });
  deleteMiniature(miniatureKey);
}

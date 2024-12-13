import prismaClient from "./prisma";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";
import { getAdminId } from "./session";
import { generateUniqueFilename } from "./utils";
import { cookies } from "next/headers";

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
  },
  requestMetadata: { origin: string }
) {
  const postMiniatureResponse = await fetch(
    `${requestMetadata.origin}/api/images?key=${postWithImageKeys.miniatureKey}`
  );

  if (postMiniatureResponse.status === 404) {
    throw new FileNotFoundError("Miniatura do post não encontrada");
  }

  if (!postMiniatureResponse.ok) throw new Error();

  const postMiniatureUrl = (
    (await postMiniatureResponse.json()) as {
      data: { url: string };
    }
  ).data.url;

  const authorProfilePictureResponse = await fetch(
    `${requestMetadata.origin}/api/images?key=${postWithImageKeys.author.profilePictureKey}`
  );

  if (authorProfilePictureResponse.status === 404) {
    throw new FileNotFoundError("Foto de perfil do autor não encontrada");
  }

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

export async function getPosts(
  params: {
    id?: number;
    search?: string;
    published?: boolean;
  },
  requestMetadata: { origin: string }
) {
  if (params.id) {
    const postWithImageKeys = await prismaClient.post.findUnique({
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

    const postWithImageUrls = await fetchRequiredImages(
      postWithImageKeys,
      requestMetadata
    );
    return [postWithImageUrls];
  }

  let postsWithImageKeys = await prismaClient.post.findMany({
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
    postsWithImageKeys.map((postWithImageKeys) => {
      return fetchRequiredImages(postWithImageKeys, requestMetadata);
    })
  );

  return postsWithImageUrls;
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

export async function createPost(
  data: {
    title: string;
    content: string;
    miniatureFile: string;
    published: boolean;
  },
  requestMetadata: { origin: string }
) {
  const adminId = await getAdminId();

  if (!adminId) throw new UnauthorizedError();

  const miniatureKey = await uploadNewMiniature(
    data.miniatureFile,
    requestMetadata
  );

  const { id } = await prismaClient.post.create({
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
  newMiniatureFile: string,
  requestMetadata: { origin: string }
) {
  const deletionResponse = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key: oldMiniatureKey }),
  });

  if (deletionResponse.status === 404) throw new FileNotFoundError();
  if (!deletionResponse.ok) throw new FileDeletionError();

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

export async function updatePost(
  data: {
    id: number;
    title?: string;
    content?: string;
    miniatureFile?: string;
    published?: boolean;
  },
  requestMetadata: { origin: string }
) {
  const post = await prismaClient.post.findUnique({ where: { id: data.id } });
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
    miniatureKey = await updateMiniature(
      post.miniatureKey,
      data.miniatureFile,
      requestMetadata
    );
  }

  await prismaClient.post.update({
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

export async function deletePost(
  data: { id: number },
  requestMetadata: { origin: string }
) {
  const post = await prismaClient.post.findUnique({ where: { id: data.id } });
  if (!post) throw new NotFoundError();

  await prismaClient.post.delete({ where: { id: data.id } });
  deleteMiniature(post.miniatureKey, requestMetadata);
}

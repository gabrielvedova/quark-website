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

async function uploadImage(
  file: string,
  requestMetadata: { origin: string },
  key?: string
) {
  key = key ? key : generateUniqueFilename();

  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key, file }),
  });

  if (!response.ok) throw new FileUploadError();

  return key;
}

async function deleteImage(key: string, requestMetadata: { origin: string }) {
  const response = await fetch(`${requestMetadata.origin}/api/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ key }),
  });

  if (response.status === 404) throw new FileNotFoundError();
  if (!response.ok) throw new FileDeletionError();
}

function listPostContentImageRaws(content: string) {
  const contentHTML = new DOMParser().parseFromString(content, "text/html");
  const images = contentHTML.querySelectorAll("img");

  return Array.from(images)
    .map((image) => image.src)
    .filter((src) => !src.startsWith("http"))
    .map((src) => src.split(",")[1]);
}

async function uploadPostContentImages(
  raws: string[],
  requestMetadata: { origin: string }
) {
  const keys: string[] = [];

  try {
    await Promise.all(
      raws.map(async (raw) => {
        const key = await uploadImage(raw, requestMetadata);
        keys.push(key);
      })
    );
    return keys;
  } catch (error) {
    await Promise.all(
      keys.map(async (key) => await deleteImage(key, requestMetadata))
    );

    throw error;
  }
}

function changeRawImageSourcesToUrls(
  content: string,
  keys: string[],
  requestMetadata: { origin: string }
) {
  const contentHTML = new DOMParser().parseFromString(content, "text/html");
  const images = contentHTML.querySelectorAll("img");

  images.forEach((image, index) => {
    if (!image.src.startsWith("http")) {
      image.src = `${requestMetadata.origin}/api/images/raw/${keys[index]}`;
    }
  });

  return contentHTML.body.innerHTML;
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

  const miniatureKey = await uploadImage(data.miniatureFile, requestMetadata);
  const imageRaws = listPostContentImageRaws(data.content);

  try {
    const imageKeys = await uploadPostContentImages(imageRaws, requestMetadata);

    const contentWithImageUrls = changeRawImageSourcesToUrls(
      data.content,
      imageKeys,
      requestMetadata
    );

    const { id } = await prismaClient.post.create({
      data: {
        title: data.title,
        content: contentWithImageUrls,
        miniatureKey,
        published: data.published,
        authorId: adminId,
        lastEditedAt: new Date(),
        postContentImages: {
          createMany: {
            data: imageKeys.map((imageKey) => ({ imageKey })),
          },
        },
      },
    });

    return id;
  } catch (error) {
    await deleteMiniature(miniatureKey, requestMetadata);
    throw error;
  }
}

async function updateMiniature(
  oldMiniatureKey: string,
  newMiniatureFile: string,
  requestMetadata: { origin: string }
) {
  await deleteImage(oldMiniatureKey, requestMetadata);
  return await uploadImage(newMiniatureFile, requestMetadata);
}

function listUnusedPostContentImages(
  oldImageKeys: string[],
  newContent: string,
  requestMetadata: { origin: string }
) {
  const newContentHTML = new DOMParser().parseFromString(
    newContent,
    "text/html"
  );
  const newImages = newContentHTML.querySelectorAll("img");
  const newImageSrcs = Array.from(newImages).map((image) => image.src);

  return oldImageKeys.filter(
    (keys) =>
      !newImageSrcs
        .map((src) =>
          src.replace(`${requestMetadata.origin}/api/images/raw/`, "")
        )
        .includes(keys)
  );
}

async function deleteUnusedPostContentImages(
  oldImageKeys: string[],
  newContent: string,
  requestMetadata: { origin: string }
) {
  const unusedImageKeys = listUnusedPostContentImages(
    oldImageKeys,
    newContent,
    requestMetadata
  );

  const imagesBackup = await Promise.all(
    unusedImageKeys.map(async (key) => {
      const response = await fetch(
        `${requestMetadata.origin}/api/images/raw/${key}`
      );

      if (response.status === 404) throw new FileNotFoundError();
      if (!response.ok) throw new Error();

      return await response.blob();
    })
  );

  const successfullyDeletedImageKeys: string[] = [];

  try {
    await Promise.all(
      unusedImageKeys.map(async (key) => {
        await deleteImage(key, requestMetadata);
        successfullyDeletedImageKeys.push(key);
      })
    );
  } catch (error) {
    await Promise.all(
      successfullyDeletedImageKeys.map(async (key, index) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadImage(
            (reader.result as string).split(",")[1],
            requestMetadata,
            unusedImageKeys[index]
          );
        };
        reader.readAsDataURL(imagesBackup[index]);
      })
    );

    throw error;
  }

  await prismaClient.postContentImage.deleteMany({
    where: { imageKey: { in: unusedImageKeys } },
  });
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
  const post = await prismaClient.post.findUnique({
    where: { id: data.id },
    include: { postContentImages: true },
  });
  if (!post) throw new NotFoundError();

  if (
    !data.title &&
    !data.content &&
    !data.miniatureFile &&
    data.published === undefined
  ) {
    return;
  }

  if (data.content) {
    const newImageRaws = listPostContentImageRaws(data.content);

    const newImageKeys = await uploadPostContentImages(
      newImageRaws,
      requestMetadata
    );

    data.content = changeRawImageSourcesToUrls(
      data.content,
      newImageKeys,
      requestMetadata
    );

    try {
      await deleteUnusedPostContentImages(
        post.postContentImages.map((image) => image.imageKey),
        post.content,
        requestMetadata
      );

      await prismaClient.postContentImage.createMany({
        data: newImageKeys.map((imageKey) => ({
          imageKey,
          postId: data.id,
        })),
      });
    } catch (error) {
      await Promise.all(
        newImageKeys.map(async (key) => await deleteImage(key, requestMetadata))
      );

      throw error;
    }
  }

  let miniatureKey: string | undefined;
  let miniatureError: Error | undefined;

  if (data.miniatureFile) {
    try {
      miniatureKey = await updateMiniature(
        post.miniatureKey,
        data.miniatureFile,
        requestMetadata
      );
    } catch (error) {
      if (error instanceof Error) miniatureError = error;
    }
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

  if (miniatureError) throw miniatureError; // Update everything except the miniature key if there was an error updating it, then throw the error
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
  const post = await prismaClient.post.findUnique({
    where: { id: data.id },
    include: { postContentImages: true },
  });
  if (!post) throw new NotFoundError();

  const imagesBackup = await Promise.all(
    post.postContentImages.map(async (image) => {
      const response = await fetch(
        `${requestMetadata.origin}/api/images/raw/${image.imageKey}`
      );

      if (response.status === 404) throw new FileNotFoundError();
      if (!response.ok) throw new Error();

      return await response.blob();
    })
  );

  const successfullyDeletedImageKeys: string[] = [];

  try {
    await Promise.all(
      post.postContentImages.map(async (image) => {
        await deleteImage(image.imageKey, requestMetadata);
        successfullyDeletedImageKeys.push(image.imageKey);
      })
    );

    await deleteMiniature(post.miniatureKey, requestMetadata);
  } catch (error) {
    await Promise.all(
      successfullyDeletedImageKeys.map(async (key, index) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadImage(
            (reader.result as string).split(",")[1],
            requestMetadata,
            successfullyDeletedImageKeys[index]
          );
        };
        reader.readAsDataURL(imagesBackup[index]);
      })
    );

    throw error;
  }

  await prismaClient.post.delete({ where: { id: data.id } });
}

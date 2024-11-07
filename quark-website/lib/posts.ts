import { stat } from "fs";
import prisma from "./db";
import { getUserId } from "./session";

export async function getPosts(params: {
  id?: number;
  search?: string;
  published?: boolean;
}) {
  if (params.id) {
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    return post ? [post] : [];
  }

  let posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: params?.search || "" } },
        { content: { contains: params?.search || "" } },
        {
          author: {
            OR: [
              { name: { contains: params?.search || "" } },
              { role: { contains: params?.search || "" } },
            ],
          },
        },
      ],
    },
  });

  if (params.published) {
    posts = posts.filter((post) => post.published === params.published);
  }

  return posts;
}

export async function createPost(data: {
  title: string;
  content: string;
  miniature: string;
  published: boolean;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const { id } = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
      lastEditedAt: new Date(),
    },
  });

  return id;
}

export async function updatePost(data: {
  id: number;
  title?: string;
  content?: string;
  miniature?: string;
  published?: boolean;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  if (
    !data.title &&
    !data.content &&
    !data.miniature &&
    data.published === undefined
  ) {
    throw new Error("Bad request");
  }

  await prisma.post.update({ where: { id: data.id }, data });
}

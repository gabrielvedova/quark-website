import prisma from "./db";
import { NotFoundError, UnauthorizedError } from "./errors";
import { getAdminId } from "./session";

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
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    return post ? [post] : [];
  }

  let posts = await prisma.post.findMany({
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
  });

  if (params.published) {
    posts = posts.filter((post) => post.published === params.published);
  }

  return posts;
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
  miniature: string;
  published: boolean;
}) {
  const adminId = await getAdminId();
  if (!adminId) throw new UnauthorizedError();

  const { id } = await prisma.post.create({
    data: {
      ...data,
      authorId: adminId,
      lastEditedAt: new Date(),
    },
  });

  return id;
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
  miniature?: string;
  published?: boolean;
}) {
  const post = await prisma.post.findUnique({ where: { id: data.id } });
  if (!post) throw new NotFoundError();

  // If no data is provided, do nothing
  if (
    !data.title &&
    !data.content &&
    !data.miniature &&
    data.published === undefined
  ) {
    return;
  }

  await prisma.post.update({ where: { id: data.id }, data });
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

  await prisma.post.delete({ where: { id: data.id } });
}

import prisma from "./db";

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

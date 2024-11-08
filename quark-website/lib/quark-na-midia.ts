import prisma from "./db";

export async function getNews(params: { id?: number }) {
  if (params.id) {
    const news = await prisma.news.findUnique({ where: { id: params.id } });
    return news ? [news] : [];
  }
  return await prisma.news.findMany();
}

export async function createNews(data: {
  title: string;
  description: string;
  miniature: string;
  publishingDate: string;
  url: string;
}) {
  return (await prisma.news.create({ data })).id;
}

export async function updateNews(data: {
  id: number;
  title?: string;
  description?: string;
  miniature?: string;
  publishingDate?: string;
  url?: string;
}) {
  const news = await prisma.news.findUnique({ where: { id: data.id } });
  if (!news) throw new Error("Not found");

  if (
    !data.title &&
    !data.description &&
    !data.miniature &&
    !data.publishingDate &&
    !data.url
  ) {
    return;
  }

  await prisma.news.update({ where: { id: data.id }, data });
}

export async function deleteNews(data: { id: number }) {
  const news = await prisma.news.findUnique({ where: { id: data.id } });
  if (!news) throw new Error("Not found");

  await prisma.news.delete({ where: { id: data.id } });
}

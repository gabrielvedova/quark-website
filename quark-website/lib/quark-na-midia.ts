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

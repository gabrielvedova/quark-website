import prisma from "./db";

export async function getNews(params: { id?: number }) {
  if (params.id) {
    const news = await prisma.news.findUnique({ where: { id: params.id } });
    return news ? [news] : [];
  }
  return await prisma.news.findMany();
}

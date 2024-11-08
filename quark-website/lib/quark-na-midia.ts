import prisma from "./db";
import { NotFoundError } from "./errors";

export async function getHeadline(params: { id?: number }) {
  if (params.id) {
    const news = await prisma.headline.findUnique({ where: { id: params.id } });
    return news ? [news] : [];
  }
  return await prisma.headline.findMany();
}

export async function createHeadline(data: {
  title: string;
  description: string;
  miniature: string;
  publishingDate: string;
  url: string;
}) {
  return (await prisma.headline.create({ data })).id;
}

export async function updateHeadline(data: {
  id: number;
  title?: string;
  description?: string;
  miniature?: string;
  publishingDate?: string;
  url?: string;
}) {
  const news = await prisma.headline.findUnique({ where: { id: data.id } });
  if (!news) throw new NotFoundError();

  if (
    !data.title &&
    !data.description &&
    !data.miniature &&
    !data.publishingDate &&
    !data.url
  ) {
    return;
  }

  await prisma.headline.update({ where: { id: data.id }, data });
}

export async function deleteHeadline(data: { id: number }) {
  const news = await prisma.headline.findUnique({ where: { id: data.id } });
  if (!news) throw new NotFoundError();

  await prisma.headline.delete({ where: { id: data.id } });
}

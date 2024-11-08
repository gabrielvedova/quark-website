import prisma from "./db";
import { NotFoundError } from "./errors";

/**
 * Get all headlines or a specific headline.
 *
 * @param params.id The id of the headline.
 *
 * @returns The headline(s).
 */
export async function getHeadline(params: { id?: number }) {
  if (params.id) {
    const news = await prisma.headline.findUnique({ where: { id: params.id } });
    return news ? [news] : [];
  }
  return await prisma.headline.findMany();
}

/**
 * Create a new headline.
 *
 * @param data.title The title of the headline.
 * @param data.description The description of the headline.
 * @param data.miniature The miniature of the headline.
 * @param data.publishingDate The publishing date of the headline.
 * @param data.url The URL of the headline.
 *
 * @returns The ID of the new headline.
 */
export async function createHeadline(data: {
  title: string;
  description: string;
  miniature: string;
  publishingDate: string;
  url: string;
}) {
  return (await prisma.headline.create({ data })).id;
}

/**
 * Update a headline.
 *
 * @param data.id The ID of the headline to update.
 * @param data.title The new title of the headline.
 * @param data.description The new description of the headline.
 * @param data.miniature The new miniature of the headline.
 * @param data.publishingDate The new publishing date of the headline.
 * @param data.url The new URL of the headline.
 *
 * @throws {NotFoundError} If the headline is not found.
 */
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

/**
 * Delete a headline.
 *
 * @param data.id The ID of the headline to delete.
 *
 * @throws {NotFoundError} If the headline is not found.
 */
export async function deleteHeadline(data: { id: number }) {
  const news = await prisma.headline.findUnique({ where: { id: data.id } });
  if (!news) throw new NotFoundError();

  await prisma.headline.delete({ where: { id: data.id } });
}

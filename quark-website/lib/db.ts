import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
  return new PrismaClient();
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

/**
 * A singleton instance of PrismaClient.
 */
const prisma = globalThis.prismaGlobal || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

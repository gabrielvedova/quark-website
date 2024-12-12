import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
  return new PrismaClient();
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClient = globalThis.prismaGlobal || prismaClientSingleton();

export default prismaClient;

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prismaClient;

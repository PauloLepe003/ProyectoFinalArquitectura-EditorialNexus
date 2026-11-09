import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
export const db = new PrismaClient();
export async function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await db.$transaction(fn, { isolationLevel: 'Serializable', timeout: 15000 });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2034' && attempt < 3)
        continue;
      throw e;
    }
  }
}

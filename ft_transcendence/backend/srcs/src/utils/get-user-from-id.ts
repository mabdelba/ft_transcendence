import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getUserFromId(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

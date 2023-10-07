import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export  async function getUserFromId(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

export  async function getUserFromLogin(login: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      login
    },
  });
  return user;
}

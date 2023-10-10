import { PrismaClient, Achievement } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAchievementFromId(id: number): Promise<Achievement | null> {
  const achievement = await prisma.achievement.findUnique({
    where: {
      id: id,
    },
  });
  return achievement;
}


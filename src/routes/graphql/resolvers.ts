import { PrismaClient } from '@prisma/client';

interface PropWithId {
  id: string;
}

export const getResolvers = (prisma: PrismaClient) => {
  return {
    memberTypes: async () => prisma.memberType.findMany(),
    memberType: async (_, { id }: PropWithId) =>
      prisma.memberType.findUnique({ where: { id } }),

    users: async () => prisma.user.findMany(),
    user: async (_, { id }: PropWithId) => prisma.user.findUnique({ where: { id } }),

    profiles: async () => prisma.profile.findMany(),
    profile: async (_, { id }: PropWithId) =>
      prisma.profile.findUnique({ where: { id } }),

    posts: async () => prisma.post.findMany(),
    post: async (_, { id }: PropWithId) => prisma.post.findUnique({ where: { id } }),
  };
};

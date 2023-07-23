import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { MemberType, MemberTypeId } from '../types/member.js';

type PropWithId = { id: string };

export const getQuery = (prisma: PrismaClient) => {
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(MemberType)),
        resolve: async () => prisma.memberType.findMany(),
      },

      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
        resolve: async (_, { id }: PropWithId) =>
          prisma.memberType.findUnique({ where: { id } }),
      },

      users: {
        type: new GraphQLNonNull(new GraphQLList(UserType)),
        resolve: async () => prisma.user.findMany(),
      },

      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: PropWithId) =>
          prisma.user.findUnique({ where: { id } }),
      },

      profiles: {
        type: new GraphQLNonNull(new GraphQLList(ProfileType)),
        resolve: async () => prisma.profile.findMany(),
      },

      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: PropWithId) =>
          prisma.profile.findUnique({ where: { id } }),
      },

      posts: {
        type: new GraphQLNonNull(new GraphQLList(PostType)),
        resolve: async () => prisma.post.findMany(),
      },

      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: PropWithId) =>
          prisma.post.findUnique({ where: { id } }),
      },
    }),
  });

  return query;
};

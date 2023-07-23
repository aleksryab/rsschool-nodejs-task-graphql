import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLFieldConfig,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../../users/schemas.js';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

interface PropWithId {
  id: string;
}
type UserTypeRootFields = Record<
  keyof Static<typeof userSchema>,
  GraphQLFieldConfig<unknown, unknown>
>;

export const userTypeRootFields: UserTypeRootFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  name: { type: new GraphQLNonNull(GraphQLString) },
  balance: { type: new GraphQLNonNull(GraphQLFloat) },
};

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    ...userTypeRootFields,

    profile: {
      type: ProfileType,
      resolve: async (root: PropWithId, _, ctx: PrismaClient) =>
        ctx.profile.findUnique({ where: { userId: root.id } }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root: PropWithId, _, ctx: PrismaClient) =>
        ctx.post.findMany({ where: { authorId: root.id } }),
    },

    memberType: {
      type: MemberType,
      resolve: async (root: PropWithId, _, ctx: PrismaClient) => {
        const profile = await ctx.profile.findUnique({ where: { userId: root.id } });
        if (!profile) return null;
        return ctx.memberType.findUnique({ where: { id: profile.memberTypeId } });
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (root: PropWithId, _, ctx: PrismaClient) =>
        ctx.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: root.id,
              },
            },
          },
        }),
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (root: PropWithId, _, ctx: PrismaClient) =>
        ctx.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: root.id,
              },
            },
          },
        }),
    },
  }),
});

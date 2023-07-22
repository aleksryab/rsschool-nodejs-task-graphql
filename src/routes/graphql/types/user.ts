import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (parent: { id: string }, _, ctx: PrismaClient) =>
        ctx.profile.findUnique({ where: { userId: parent.id } }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: { id: string }, _, ctx: PrismaClient) =>
        ctx.post.findMany({ where: { authorId: parent.id } }),
    },

    memberType: {
      type: MemberType,
      resolve: async (parent: { id: string }, _, ctx: PrismaClient) => {
        const profile = await ctx.profile.findUnique({ where: { userId: parent.id } });
        if (!profile) return null;
        return ctx.memberType.findUnique({ where: { id: profile.memberTypeId } });
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (parent: { id: string }, _, ctx: PrismaClient) =>
        ctx.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        }),
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (parent: { id: string }, _, ctx: PrismaClient) =>
        ctx.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        }),
    },
  }),
});

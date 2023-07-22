import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql';
import { getResolvers } from './resolvers.js';
import { MemberType, MemberTypeId } from './types/member.js';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const buildGraphQLSchema = (prisma: PrismaClient) => {
  const resolvers = getResolvers(prisma);

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(MemberType)),
        resolve: resolvers.memberTypes,
      },

      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
        resolve: resolvers.memberType,
      },

      users: {
        type: new GraphQLNonNull(new GraphQLList(UserType)),
        resolve: resolvers.users,
      },

      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: resolvers.user,
      },

      profiles: {
        type: new GraphQLNonNull(new GraphQLList(ProfileType)),
        resolve: resolvers.profiles,
      },

      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: resolvers.profile,
      },

      posts: {
        type: new GraphQLNonNull(new GraphQLList(PostType)),
        resolve: resolvers.posts,
      },

      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: resolvers.post,
      },
    }),
  });

  return new GraphQLSchema({ query });
};

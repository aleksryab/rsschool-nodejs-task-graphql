import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },

    author: {
      type: UserType,
      resolve: ({ authorId }: { authorId: string }, _, ctx: PrismaClient) =>
        ctx.user.findUnique({ where: { id: authorId } }),
    },
  }),
});

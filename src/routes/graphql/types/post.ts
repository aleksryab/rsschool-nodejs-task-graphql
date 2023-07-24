import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { postSchema } from '../../posts/schemas.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { GQLContext } from './common.js';

export type Post = Static<typeof postSchema>;

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },

    author: {
      type: UserType,
      resolve: async ({ authorId }: Post, _, { db }: GQLContext) => {
        return await db.user.findUnique({ where: { id: authorId } });
      },
    },
  }),
});

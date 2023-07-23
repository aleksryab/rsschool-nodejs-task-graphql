import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { getFieldsFromTypeBySchema } from './helpers/getFieldsFromTypeBySchema.js';

// Create Post
type CreatePostData = Static<typeof createPostSchema.body>;
type CreatePostBody = {
  dto: CreatePostData;
};

const createPostInputFields = getFieldsFromTypeBySchema(
  PostType,
  createPostSchema.body.properties,
);
export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: createPostInputFields,
});

export const createPostField = {
  type: PostType,
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInputType) },
  },
  resolve: async (_, body: CreatePostBody, ctx: PrismaClient) => {
    return await ctx.post.create({ data: body.dto });
  },
};

// Delete Post
export const deletePostField = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }: { id: string }, ctx: PrismaClient) => {
    const result = await ctx.post.delete({ where: { id } });
    return !!result;
  },
};

// Change Post
type ChangePostData = Static<typeof changePostByIdSchema.body>;
type ChangePostInputFields = Record<keyof ChangePostData, GraphQLInputFieldConfig>;
type ChangePostBody = {
  id: string;
  dto: ChangePostData;
};

const ChangePostInputFields: ChangePostInputFields = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
};

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: ChangePostInputFields,
});

export const changePostField = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangePostInputType },
  },
  resolve: async (_, body: ChangePostBody, ctx: PrismaClient) => {
    return await ctx.post.update({ where: { id: body.id }, data: body.dto });
  },
};

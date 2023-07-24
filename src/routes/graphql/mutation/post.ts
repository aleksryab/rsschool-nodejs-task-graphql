import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { getFieldsFromTypeBySchema } from './helpers/getFieldsFromTypeBySchema.js';
import { FieldConfig } from '../types/common.js';

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

export const createPostField: FieldConfig = {
  type: PostType,
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInputType) },
  },
  resolve: async (_, body: CreatePostBody, { db }) => {
    return await db.post.create({ data: body.dto });
  },
};

// Delete Post
export const deletePostField: FieldConfig = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }: { id: string }, { db }) => {
    const result = await db.post.delete({ where: { id } });
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

export const changePostField: FieldConfig = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangePostInputType },
  },
  resolve: async (_, body: ChangePostBody, { db }) => {
    return await db.post.update({ where: { id: body.id }, data: body.dto });
  },
};

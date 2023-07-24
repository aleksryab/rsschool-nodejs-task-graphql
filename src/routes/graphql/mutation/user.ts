import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { createUserSchema, changeUserByIdSchema } from '../../users/schemas.js';
import { UserType } from '../types/user.js';
import { getFieldsFromTypeBySchema } from './helpers/getFieldsFromTypeBySchema.js';
import { UUIDType } from '../types/uuid.js';
import { FieldConfig } from '../types/common.js';

// Create User
type CreateUserData = Static<typeof createUserSchema.body>;
type CreateUserBody = {
  dto: CreateUserData;
};

const createUserInputFields = getFieldsFromTypeBySchema(
  UserType,
  createUserSchema.body.properties,
);

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: createUserInputFields,
});

export const createUserField: FieldConfig = {
  type: UserType,
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInputType) },
  },
  resolve: async (_, body: CreateUserBody, { db }) => {
    return await db.user.create({ data: body.dto });
  },
};

// Delete User
export const deleteUserField: FieldConfig = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }: { id: string }, { db }) => {
    const result = await db.user.delete({ where: { id } });
    return !!result;
  },
};

// Change User
type ChangeUserData = Static<typeof changeUserByIdSchema.body>;
type ChangeUserInputFields = Record<keyof ChangeUserData, GraphQLInputFieldConfig>;
type ChangeUserBody = {
  id: string;
  dto: ChangeUserData;
};

const changeUserInputFields: ChangeUserInputFields = {
  balance: { type: GraphQLFloat },
  name: { type: GraphQLString },
};

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: changeUserInputFields,
});

export const changeUserField: FieldConfig = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangeUserInputType },
  },
  resolve: async (_, body: ChangeUserBody, { db }) => {
    return await db.user.update({ where: { id: body.id }, data: body.dto });
  },
};

// User subscribeTo
type SubscribeBody = {
  userId: string;
  authorId: string;
};

export const subscribeToField: FieldConfig = {
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }: SubscribeBody, { db }) => {
    return await db.user.update({
      where: { id: userId },
      data: { userSubscribedTo: { create: { authorId } } },
    });
  },
};

// User unsubscribeFrom
export const unsubscribeFromField: FieldConfig = {
  type: GraphQLBoolean,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }: SubscribeBody, { db }) => {
    const result = await db.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });

    return !!result;
  },
};

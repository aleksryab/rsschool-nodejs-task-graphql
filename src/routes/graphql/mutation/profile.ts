import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import { ProfileType } from '../types/profile.js';
import { getFieldsFromTypeBySchema } from './helpers/getFieldsFromTypeBySchema.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from '../types/member.js';

// Create Profile
type CreateProfileData = Static<typeof createProfileSchema.body>;
type CreateProfileBody = {
  dto: CreateProfileData;
};

const createProfileInputFields = getFieldsFromTypeBySchema(
  ProfileType,
  createProfileSchema.body.properties,
);

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: createProfileInputFields,
});

export const createProfileField = {
  type: ProfileType,
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInputType) },
  },
  resolve: async (_, body: CreateProfileBody, ctx: PrismaClient) => {
    return await ctx.profile.create({ data: body.dto });
  },
};

// Delete Profile
export const deleteProfileField = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }: { id: string }, ctx: PrismaClient) => {
    const result = await ctx.profile.delete({ where: { id } });
    return !!result;
  },
};

// Change Profile
type ChangeProfileData = Static<typeof changeProfileByIdSchema.body>;
type ChangeProfileInputFields = Record<keyof ChangeProfileData, GraphQLInputFieldConfig>;
type ChangeProfileBody = {
  id: string;
  dto: ChangeProfileData;
};

const ChangeProfileInputFields: ChangeProfileInputFields = {
  isMale: { type: GraphQLBoolean },
  memberTypeId: { type: MemberTypeId },
  yearOfBirth: { type: GraphQLInt },
};

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: ChangeProfileInputFields,
});

export const changeProfileField = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangeProfileInputType },
  },
  resolve: async (_, body: ChangeProfileBody, ctx: PrismaClient) => {
    return await ctx.profile.update({ where: { id: body.id }, data: body.dto });
  },
};

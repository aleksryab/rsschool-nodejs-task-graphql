import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from '../types/member.js';
import { FieldConfig } from '../types/common.js';
import { getFieldsFromTypeBySchema } from './helpers/getFieldsFromTypeBySchema.js';

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

export const createProfileField: FieldConfig = {
  type: ProfileType,
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInputType) },
  },
  resolve: async (_, body: CreateProfileBody, { db }) => {
    return await db.profile.create({ data: body.dto });
  },
};

// Delete Profile
export const deleteProfileField: FieldConfig = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }: { id: string }, { db }) => {
    try {
      await db.profile.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
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

export const changeProfileField: FieldConfig = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: ChangeProfileInputType },
  },
  resolve: async (_, body: ChangeProfileBody, { db }) => {
    return await db.profile.update({ where: { id: body.id }, data: body.dto });
  },
};

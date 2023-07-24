import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import {
  MemberTypeId as MemberTypeIdEnum,
  memberTypeSchema,
} from '../../member-types/schemas.js';

export type Member = Static<typeof memberTypeSchema>;

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeIdEnum.BASIC]: { value: MemberTypeIdEnum.BASIC },
    [MemberTypeIdEnum.BUSINESS]: { value: MemberTypeIdEnum.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

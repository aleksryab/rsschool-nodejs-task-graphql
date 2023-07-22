import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';
import { UserType } from './user.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },

    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _, ctx: PrismaClient) =>
        ctx.memberType.findUnique({ where: { id: parent.memberTypeId } }),
    },

    user: { type: UserType },
  }),
});

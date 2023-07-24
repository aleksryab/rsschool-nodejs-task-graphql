import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { profileSchema } from '../../profiles/schemas.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';
import { GQLContext } from './common.js';

export type Profile = Static<typeof profileSchema>;

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
      resolve: async (root: Profile, _, { loaders }: GQLContext) => {
        return await loaders.memberType.load(root.memberTypeId);
      },
    },
  }),
});

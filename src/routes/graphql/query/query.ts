import { GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  ResolveTree,
} from 'graphql-parse-resolve-info';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { MemberType, MemberTypeId } from '../types/member.js';
import { GQLContext } from '../types/common.js';

type ArgsWhiId = { id: string };

export const query = new GraphQLObjectType<unknown, GQLContext>({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(MemberType)),
      resolve: async (_, __, { db }) => await db.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_, { id }: ArgsWhiId, { db }) => {
        return await db.memberType.findUnique({ where: { id } });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (_, __, { db, loaders }, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;

        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo,
          info.returnType,
        );

        const userSubscribedTo = 'userSubscribedTo' in fields;
        const subscribedToUser = 'subscribedToUser' in fields;

        const users = await db.user.findMany({
          include: { userSubscribedTo, subscribedToUser },
        });

        users.forEach((user) => loaders.user.prime(user.id, user));
        return users;
      },
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: ArgsWhiId, { loaders }) => await loaders.user.load(id),
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(ProfileType)),
      resolve: async (_, __, { db }) => await db.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: ArgsWhiId, { db }) => {
        return await db.profile.findUnique({ where: { id } });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: async (_, __, { db }) => await db.post.findMany(),
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: ArgsWhiId, { db }) => {
        return await db.post.findUnique({ where: { id } });
      },
    },
  }),
});

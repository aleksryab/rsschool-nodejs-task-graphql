import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { userSchema } from '../../users/schemas.js';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { GQLContext } from './common.js';

export type User = Static<typeof userSchema>;
export interface UserWithSubs extends User {
  userSubscribedTo?: {
    subscriberId: string;
    authorId: string;
  }[];
  subscribedToUser?: {
    subscriberId: string;
    authorId: string;
  }[];
}

export const UserType: GraphQLObjectType = new GraphQLObjectType<User, GQLContext>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (root, _, { loaders }) => {
        return await loaders.profile.load(root.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root, _, { loaders }) => {
        return await loaders.posts.load(root.id);
      },
    },

    memberType: {
      type: MemberType,
      resolve: async (root, _, { db }) => {
        return db.user
          .findUnique({ where: { id: root.id } })
          .profile()
          .memberType();
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async ({ userSubscribedTo }: UserWithSubs, _, { loaders }) => {
        if (userSubscribedTo) {
          return loaders.user.loadMany(userSubscribedTo.map((user) => user.authorId));
        }
        return [];
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async ({ subscribedToUser }: UserWithSubs, _, { loaders }) => {
        if (subscribedToUser) {
          return loaders.user.loadMany(subscribedToUser.map((user) => user.subscriberId));
        }
        return [];
      },
    },
  }),
});

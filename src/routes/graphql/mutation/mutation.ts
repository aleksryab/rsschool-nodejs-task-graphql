import { GraphQLObjectType } from 'graphql';
import {
  createUserField,
  deleteUserField,
  changeUserField,
  subscribeToField,
  unsubscribeFromField,
} from './user.js';
import { changeProfileField, createProfileField, deleteProfileField } from './profile.js';
import { changePostField, createPostField, deletePostField } from './post.js';
import { GQLContext } from '../types/common.js';

export const mutation = new GraphQLObjectType<unknown, GQLContext>({
  name: 'Mutation',
  fields: () => ({
    createUser: createUserField,
    changeUser: changeUserField,
    deleteUser: deleteUserField,
    subscribeTo: subscribeToField,
    unsubscribeFrom: unsubscribeFromField,
    createProfile: createProfileField,
    changeProfile: changeProfileField,
    deleteProfile: deleteProfileField,
    createPost: createPostField,
    changePost: changePostField,
    deletePost: deletePostField,
  }),
});

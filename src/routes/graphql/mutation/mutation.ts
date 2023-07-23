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

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: createUserField,
    createProfile: createProfileField,
    createPost: createPostField,
    deleteUser: deleteUserField,
    deleteProfile: deleteProfileField,
    deletePost: deletePostField,
    changeUser: changeUserField,
    changeProfile: changeProfileField,
    changePost: changePostField,
    subscribeTo: subscribeToField,
    unsubscribeFrom: unsubscribeFromField,
  }),
});

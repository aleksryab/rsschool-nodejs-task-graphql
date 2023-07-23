import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { mutation } from './mutation/mutation.js';
import { getQuery } from './query/query.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const buildGraphQLSchema = (prisma: PrismaClient) => {
  const query = getQuery(prisma);
  return new GraphQLSchema({ query, mutation });
};

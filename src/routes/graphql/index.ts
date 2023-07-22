import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  createGqlResponseSchema,
  gqlResponseSchema,
  buildGraphQLSchema,
} from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const schema = buildGraphQLSchema(fastify.prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const { data, errors } = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: fastify.prisma,
      });

      return { data, errors };
    },
  });
};

export default plugin;

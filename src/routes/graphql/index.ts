import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { createDataLoaders } from './loaders/loaders.js';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const loaders = createDataLoaders(fastify.prisma);

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

      const validationErrors = validate(gqlSchema, parse(query), [
        depthLimit(DEPTH_LIMIT),
      ]);
      if (validationErrors.length) return { errors: validationErrors };

      const { data, errors } = await graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          db: fastify.prisma,
          loaders,
        },
      });

      return { data, errors };
    },
  });
};

export default plugin;

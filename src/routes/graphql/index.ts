import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import {
  createGqlResponseSchema,
  gqlResponseSchema,
  buildGraphQLSchema,
} from './schemas.js';

const DEPTH_LIMIT = 5;

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

      const validationErrors = validate(schema, parse(query), [depthLimit(DEPTH_LIMIT)]);
      if (validationErrors.length) return { errors: validationErrors };

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

import { GraphQLFieldConfig } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { LoadersMap } from '../loaders/loaders.js';

export interface GQLContext {
  db: PrismaClient;
  loaders: LoadersMap;
}

export type FieldConfig = GraphQLFieldConfig<unknown, GQLContext>;

import { GraphQLObjectType, GraphQLInputFieldConfig } from 'graphql';

export const getFieldsFromTypeBySchema = (
  type: GraphQLObjectType,
  schema: Record<string, unknown>,
): Record<string, GraphQLInputFieldConfig> => {
  const typeFields = type.getFields();
  const fields = {};

  Object.keys(schema).forEach((key) => {
    if (key in typeFields) {
      fields[key] = { type: typeFields[key].type };
    }
  });

  return fields;
};

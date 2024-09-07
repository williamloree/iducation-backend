import { ApolloError } from "apollo-server-core";
import { GraphQLError } from "graphql";

const publicEndpoints = {
  query: [
    "ping",
    "courses",
    "categories",
    "teachers",
    "teachersBySlug",
    "coursesBySlug",
    "coursesByTeacher",
    "tags",
  ],
  mutation: ["login", "addUser"],
};
// For expose public endpoint
export const didResolveOperationExec = function (ctx: any) {
  const operationName = ctx.operation.selectionSet.selections[0].name.value;
  if (
    operationName &&
    !["IntrospectionQuery", "__schema"].includes(operationName) &&
    ctx.operation.operation &&
    // @ts-ignore
    !publicEndpoints[ctx.operation.operation].includes(operationName) &&
    !ctx.contextValue.currentUser
  ) {
    console.log("☠️  ERROR Endpoint close : " + operationName);
    throw new Error("User not authenticated.");
  }
};

// For send error of context
export const didEncounterErrorsExec = function (ctx: any): Promise<void> {
  if (!ctx.operation) {
    return Promise.resolve();
  }
  if (ctx.errors) {
    for (const err of ctx.errors) {
      if (err instanceof ApolloError) {
        continue;
      } else {
        if (
          err instanceof GraphQLError &&
          err.extensions.code === "BAD_USER_INPUT" &&
          err.message === "validation"
        ) {
          continue;
        }
        if (err.extensions?.code) {
          ctx.response.http.status = err.extensions?.code;
        }
      }
    }
  }
  return Promise.resolve();
};

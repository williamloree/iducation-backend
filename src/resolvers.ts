import {
  mutations as UsersMutations,
  queries as UsersQueries,
} from "./resolvers/UsersResolver";

import {
  mutations as CourseMutations,
  queries as CourseQueries,
} from "./resolvers/CourseResolver";


import {
  queries as TagsQueries,
} from "./resolvers/TagsResolver";

import { Resolvers } from "./generated/graphql";

export const resolvers: Resolvers = {
  Query: {
    ping: () => {
      return "pong !";
    },
    ...UsersQueries,
    ...CourseQueries,
    ...TagsQueries,
  },
  Mutation: {
    ...UsersMutations,
    ...CourseMutations
  },
};

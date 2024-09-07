import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { User } from "./entities/User";

import { Context } from "./@types/graphql";
import { AppDataSource } from "./config/database";
import { didEncounterErrorsExec, didResolveOperationExec } from "./plugins";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getUserFromBearer } from "./helpers/Misc";

dayjs.extend(relativeTime);

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(context) {
            await didEncounterErrorsExec(context);
          },
          async didResolveOperation(context) {
            await didResolveOperationExec(context);
          },
        };
      },
    },
  ],
});

export const start = async () => {
  AppDataSource.initialize()

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001, host: "0.0.0.0" },
    // listen: { port: 4000, host: "0.0.0.0" },
    context: async ({ req }) => {
      const authToken = req.headers["authorization"]?.replace("Bearer ", "");
      let currentUser: User | null = null;
      if (authToken) {
        currentUser = await getUserFromBearer(authToken);
      }
      return {
        authToken,
        currentUser,
      };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};

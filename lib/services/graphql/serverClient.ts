import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  // Use the built-in fetch (works in Next server)
  fetch: globalThis.fetch,
});

export const apolloServerClient = new ApolloClient({
  ssrMode: true,
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Patient: {
        keyFields: ["_id"],
        fields: {
          id: {
            read(_, { readField }) {
              return readField("_id");
            },
          },
        },
      },
      Exam: {
        keyFields: ["_id"],
        fields: {
          id: {
            read(_, { readField }) {
              return readField("_id");
            },
          },
        },
      },
    },
  }),
});

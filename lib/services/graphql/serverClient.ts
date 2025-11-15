import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  // Use the built-in fetch (works in Next server)
  fetch: globalThis.fetch,
});

const defaultCache = new InMemoryCache({
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
});

function createAuthLink(token?: string) {
  return new ApolloLink((operation, forward) => {
    const ctx = operation.getContext() || {};
    // token param has priority, then operation context fields
    const tokenFromCtx =
      token ??
      ctx.token ??
      ctx.headers?.token ??
      ctx.headers?.authorization ??
      ctx.headers?.Authorization;

    const authorization = tokenFromCtx ? `Bearer ${tokenFromCtx}` : "";

    operation.setContext({
      headers: {
        ...(ctx.headers || {}),
        Authorization: authorization,
      },
    });

    return forward(operation);
  });
}

// Default server client (no fixed token) — callers may pass `context: { token }`.
export const apolloServerClient = new ApolloClient({
  ssrMode: true,
  link: createAuthLink().concat(httpLink),
  cache: defaultCache,
});

// Factory: create a server Apollo Client bound to a specific token (useful in server handlers)
export function createServerApolloClient(token?: string) {
  return new ApolloClient({
    ssrMode: true,
    link: createAuthLink(token).concat(httpLink),
    cache: defaultCache,
  });
}

"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import type { User } from "firebase/auth";
import { useAuthStore } from "@/lib/stores/user";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

// helper to obtain the token; avoid using React hooks in module scope — read directly from the store
async function getFirebaseToken(): Promise<string | null> {
  try {
    const user = useAuthStore.getState().user as User | null;
    if (!user) return null;
    const token = await user.getIdToken();
    return token || null;
  } catch {
    return null;
  }
}

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let sub: { unsubscribe: () => void } | null = null;
    (async () => {
      try {
        const token = await getFirebaseToken();
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        }));
      } catch {
        // ignore token errors and continue without Authorization header
      }

      try {
        sub = forward(operation).subscribe({
          next: (result) => observer.next(result),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      } catch (err) {
        observer.error(err);
      }
    })();

    return () => {
      if (sub) sub.unsubscribe();
    };
  });
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Patient: {
        // Server returns `_id`; use it as the cache key
        keyFields: ["_id"],
        fields: {
          // expose `id` as a read alias for `_id` to keep app code stable
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

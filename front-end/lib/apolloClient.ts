import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { from } from '@apollo/client';
import Router from 'next/router';


const createApolloClient = () => {

  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql', // Your GraphQL endpoint
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Handle Errors
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          localStorage.removeItem('token');
          Router.push('/login');
          break;
        }
      }
    }
  
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  });
};


export const client = createApolloClient();

export function useApollo(initialState: NormalizedCacheObject) {
  const apolloClient = client;
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }
  return apolloClient;
}


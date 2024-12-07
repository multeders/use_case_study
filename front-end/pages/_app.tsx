import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <AuthProvider>
        <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
        </ApolloProvider>
    </AuthProvider>
  );
}

export default MyApp;

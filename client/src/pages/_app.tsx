import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import {
  PaginatedPosts,
  PaginatedComments,
} from '../generated/generated-types';

const client = new ApolloClient({
  uri: 'https://litepost-server-production.up.railway.app/graphql',
  credentials: 'include',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
          getComments: {
            keyArgs: [],
            merge(
              existing: PaginatedComments | undefined,
              incoming: PaginatedComments
            ): PaginatedComments {
              return {
                ...incoming,
                comments: [...(existing?.comments || []), ...incoming.comments],
              };
            },
          },
        },
      },
    },
  }),
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Litepost</title>
      </Head>
      <ApolloProvider client={client}>
        <Navbar />
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
};

export default App;

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Litepost</title>
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
};

export default App;

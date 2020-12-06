import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers:{
    authorization:'Bearer 5cec7b60065c643bece5966a2642234f9937b7ce'
  }
});

export {client};
import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';

export const useResetComments = () => {
  const client = useApolloClient();

  useEffect(() => {
    client.cache.evict({ fieldName: 'getComments:{}' });
  }, []);
};

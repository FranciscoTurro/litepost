import router from 'next/router';
import { useEffect } from 'react';
import { useCurrentUserQuery } from '../generated/generated-types';

export const useIsAuth = () => {
  const { data, loading } = useCurrentUserQuery();

  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.replace('/login');
    }
  }, [loading, data, router]);
};

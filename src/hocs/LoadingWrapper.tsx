import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Loading from '@/components/Loading';

const LoadingWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
};

export default React.memo(LoadingWrapper);

import React from 'react';

import Loading from '@/components/Loading';
import { useAppSelector } from '@/stores';

const GlobalLoading: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loadingCount } = useAppSelector((state: { loading: any }) => state.loading);

  return (
    <>
      {loadingCount && <Loading />}
      {children}
    </>
  );
};

export default React.memo(GlobalLoading);

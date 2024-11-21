import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import Loading from '@/components/Loading';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

const RouterProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <BrowserRouter>
    <ScrollToTop />
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </BrowserRouter>
);
export default React.memo(RouterProvider);

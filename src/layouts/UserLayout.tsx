import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import React from 'react';

import Footer from '@/layouts/footer/footer';
import Header from '@/layouts/header/header';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Sidebar = dynamic(() => import('@/components/Sidebar'), {
  loading: () => <span className="text-center font-bold text-blue-600 sm:text-xl">Loading....</span>
});

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  title = 'Cẩm nang',
  description = '9D Cửu Long Cố Nhân - Cẩm nang'
}) => {
  return (
    <Main meta={<Meta title={title} description={description} />}>
      <Header />
      <Sidebar />
      {children}
      <Footer />
    </Main>
  );
};

export default UserLayout;

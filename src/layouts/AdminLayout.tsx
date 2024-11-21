import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo } from 'react';

import { Meta } from '@/layouts/Meta';
import { useAppSelector } from '@/stores';
import { Main } from '@/templates/Main';

const AdminSidebar = dynamic(() => import('@/components/AdminSidebar'), {
  loading: () => <span className="text-center font-bold text-blue-600 sm:text-xl">Loading....</span>
});

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useAppSelector((state) => state.admin);
  const router = useRouter();

  if (!user.accessToken || user.user.roles !== 'ADMIN') {
    router.replace('/admin/login');
    return null;
  }

  return (
    <Main
      meta={
        <Meta
          title="Quản trị website"
          description="9D Cửu Long Cố Nhân Xin Chào Tất Cả Các Vị Bằng Hữu."
        />
      }
    >
      <AdminSidebar />
      {children}
    </Main>
  );
};

export default memo(AdminLayout);

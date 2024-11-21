import { motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import NewsListTable from '@/pages/admin/component/manager-news-table';
import { useAppDispatch } from '@/stores';
import { getLinkGameAction } from '@/stores/home';

export default function ManagerNews() {
  const dispatch = useAppDispatch();

  const getData = useCallback(async () => {
    return dispatch(getLinkGameAction());
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

  return (
    <AdminLayout>
      <motion.div
        className="ml-64"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]">
          <span className="text-5xl font-bold text-yellow">Quản lý tin tức </span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y px-8 py-4 text-center text-2xl text-black">
            Gồm các chức năng : Ẩn tin, xoá tin, chỉnh sửa tin tức
          </span>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="box-border flex h-fit w-full items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
        >
          <div className="mx-12 flex h-full w-full items-center justify-center text-neutral-800 dark:text-neutral-200">
            <NewsListTable />
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

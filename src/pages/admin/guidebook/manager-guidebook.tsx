import { motion } from 'framer-motion';
import type { GetServerSideProps } from 'next';
import React from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import { getAllGuideBook } from '@/libs/mongooDb';
import GuideBookTable from '@/pages/admin/component/manager-guidebook-table';

type DataProp = {
  guidebooks: any[];
};

export const getServerSideProps: GetServerSideProps<DataProp> = async (context) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=59');
  try {
    const guidebooks = await getAllGuideBook();
    return {
      props: {
        guidebooks
      }
    };
  } catch (error) {
    return {
      props: {
        guidebooks: []
      }
    };
  }
};

export default function ManagerGuidebook({ guidebooks = [] }: DataProp) {
  return (
    <AdminLayout>
      <motion.div
        className="ml-64"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]">
          <span className="text-5xl font-bold text-yellow">Quản lý bài viết cẩm nang </span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y px-8 py-4 text-center text-2xl text-black">
            Gồm các chức năng : Chỉ xoá được bài viết, nếu sai thì đăng lại
          </span>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="box-border flex h-fit w-full items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
        >
          <div className="mx-12 flex h-full w-full items-center justify-center text-neutral-800 dark:text-neutral-200">
            <GuideBookTable dataTable={guidebooks} />
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

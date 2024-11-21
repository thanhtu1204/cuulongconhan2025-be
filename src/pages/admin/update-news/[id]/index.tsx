import { motion } from 'framer-motion';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import FormNews from '@/pages/admin/update-news/[id]/form';
import { useAppSelector } from '@/stores';

export default function UpdateNews() {
  const router = useRouter();
  const { id } = router.query;
  const listNewsFull = useAppSelector((state) => state.admin.listNewsFull);
  const foundNewsData: any = _.find(listNewsFull, { news_id: Number(id) });

  return (
    <AdminLayout>
      <motion.div
        className="ml-64"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]">
          <span className="text-5xl font-bold text-yellow">Sửa tin</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Vui lòng chỉnh sửa thông tin cho bài viết
          </span>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="box-border flex h-fit w-full items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
        >
          <div className="mx-12 flex h-full w-full items-center justify-center text-neutral-800 dark:text-neutral-200">
            {foundNewsData && <FormNews news={foundNewsData} />}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

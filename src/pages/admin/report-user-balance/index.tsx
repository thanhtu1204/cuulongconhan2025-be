import { motion } from 'framer-motion';
import React from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import UserBalanceTable from '@/pages/admin/component/user-balance-table';

function Index() {
  return (
    <AdminLayout>
      <motion.div
        className="ml-64 "
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {/* <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]"> */}
        {/*  <span className="text-5xl font-bold text-yellow">Quản trị website</span> */}
        {/* </div> */}

        <h1 className="my-6 text-center text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Thống kê lịch sử GD user
        </h1>
        {/* <!-- Cards --> */}
        <div className="flex flex-col px-12">
          <div>
            <UserBalanceTable />
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

export default Index;

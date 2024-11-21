import { motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { FaHouseUser, FaWallet } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { LiaBalanceScaleSolid } from 'react-icons/lia';
import { TfiReload } from 'react-icons/tfi';
import { toast } from 'react-toastify';

import InfoCard from '@/components/Cards/InfoCard';
import RoundIcon from '@/components/RoundIcon';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardTable from '@/pages/admin/component/dashbroad-table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { dashBoardCronAction, getDashBoardAction } from '@/stores/admin';
import { numberWithDot } from '@/utils/utils';

function Dashboard() {
  const dispatch = useAppDispatch();

  const dashboard = useAppSelector((state) => state.admin.dashboard);
  const loading = useAppSelector((state) => state.admin.loading);

  const getData = useCallback(async () => {
    return dispatch(getDashBoardAction());
  }, [dispatch]);

  const reloadCronJob = async () => {
    const cronJob: any = await dispatch(dashBoardCronAction());
    if (cronJob?.payload?.status === 200) {
      setTimeout(() => {
        getData().then(() => {});
      }, 1500);
      return toast.success('Tải lại giao dịch thành công');
    }
    return toast.error('Tải lại giao dịch thất bại');
  };
  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

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
          Dashboard
        </h1>
        {/* <!-- Cards --> */}
        <div className="flex flex-col px-12">
          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Tổng số User" value={String(dashboard?.user_count)}>
              <RoundIcon
                icon={FaHouseUser}
                iconColorClass="text-orange-500 dark:text-orange-100"
                bgColorClass="bg-orange-100 dark:bg-orange-500"
                className="mr-4"
              />
            </InfoCard>

            <InfoCard
              title="Tổng nạp"
              value={`$ ${String(numberWithDot(dashboard?.trans.amount_total || 0))}`}
            >
              <RoundIcon
                icon={FaWallet}
                iconColorClass="text-green-500 dark:text-green-100"
                bgColorClass="bg-green-100 dark:bg-green-500"
                className="mr-4"
              />
            </InfoCard>

            <InfoCard
              title="Tổng giao dịch"
              value={`${String(numberWithDot(dashboard?.trans.row_count || 0))}`}
            >
              <RoundIcon
                icon={LiaBalanceScaleSolid}
                iconColorClass="text-blue-500 dark:text-blue-100"
                bgColorClass="bg-blue-100 dark:bg-blue-500"
                className="mr-4"
              />
            </InfoCard>

            <InfoCard title="Không xác định" value="35">
              <RoundIcon
                icon={HiOutlineExclamationCircle}
                iconColorClass="text-teal-500 dark:text-teal-100"
                bgColorClass="bg-teal-100 dark:bg-teal-500"
                className="mr-4"
              />
            </InfoCard>
          </div>
          <div>
            <div className="flex justify-start">
              <button
                disabled={loading}
                type="button"
                onClick={reloadCronJob}
                className=" mb-4 inline-flex items-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
              >
                <RoundIcon
                  icon={TfiReload}
                  iconColorClass="text-teal-500 dark:text-teal-100"
                  bgColorClass="bg-teal-100 dark:bg-teal-500"
                  className="mr-4"
                />
                <span>Tải lại giao dịch</span>
              </button>
            </div>
          </div>
          <div>
            <h1 className="my-6 text-center text-2xl font-semibold text-gray-700 dark:text-gray-200">
              10 giao dịch gần đây
            </h1>
            <DashboardTable />
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

export default Dashboard;

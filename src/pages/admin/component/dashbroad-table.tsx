import { flatMap } from 'lodash';
import moment from 'moment';
import React, { memo, useCallback } from 'react';
import { utils, writeFile } from 'xlsx';

import { useAppSelector } from '@/stores';
import { numberWithDot } from '@/utils/utils';

const DashboardTable = () => {
  const dashboard = useAppSelector((state) => state.admin.dashboard);
  const itemsAllTrans = dashboard?.allTrans || [];

  // Chỉ lấy 20 phần tử đầu tiên
  const first20Items = itemsAllTrans.slice(0, 10);

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    const dataExport: any = [...itemsAllTrans];
    const promises = dataExport.map(
      (item: any) =>
        new Promise((resolve) => {
          const newItem = {
            ...item,
            real_amount: numberWithDot(
              Number(item?.amount ?? 0) / (1 + Number(item?.discount_percentage || 0) / 100)
            )
          };
          resolve(newItem);
        })
    );

    Promise.all(promises).then((updatedDataExport) => {
      /* generate worksheet from state */
      const ws = utils.json_to_sheet(updatedDataExport);
      /* create workbook and append worksheet */
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Data');
      /* export to XLSX */
      writeFile(wb, 'all-transaction-bank.xlsx');
    });
  }, [itemsAllTrans]);

  return (
    <div className="relative mb-6 flex w-full min-w-0 flex-col  break-words shadow-lg ">
      <div className="block w-full overflow-x-auto">
        {/* Projects table */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={exportFile}
            className=" mb-4 inline-flex items-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
          >
            <svg
              className="mr-2 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Xuất file</span>
          </button>
        </div>

        <table className=" w-full border-collapse items-center bg-transparent ">
          <thead>
            <tr>
              <th className=" whitespace-nowrap rounded-tl-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                ID
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                User Id
              </th>

              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Transaction bank id
              </th>

              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Thời gian
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Transaction description
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Số tiền
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Tỉ lệ KM
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Thực nhận
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl bg-[#334155]">
            {flatMap(first20Items, (item) => (
              <tr key={item.transaction_id}>
                <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  <span className="text-center text-xs text-white">{item?.transaction_id}</span>
                </th>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.user_id}
                </td>

                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item.transaction_bank_id}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {moment
                    .unix(Number(item?.create_at_timestamp) / 1000)
                    .utc()
                    .format('DD/MM/YYYY HH:mm:ss')}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.transaction_description}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {numberWithDot(item?.amount || 0)}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.discount_percentage}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-blue-600">
                  {numberWithDot(
                    Number(item?.amount ?? 0) / (1 + Number(item?.discount_percentage || 0) / 100)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(DashboardTable);

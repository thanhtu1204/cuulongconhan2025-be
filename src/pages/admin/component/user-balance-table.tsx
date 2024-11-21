import _, { flatMap } from 'lodash';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';

import Pagination from '@/components/Pagination';
import { useAppDispatch, useAppSelector } from '@/stores';
import { adminActions, getUserBalanceHistoryAction } from '@/stores/admin';
import { numberWithDot } from '@/utils/utils';

const UserBalanceTable = () => {
  const dispatch = useAppDispatch();

  const listHistory = useAppSelector((state) => state.admin.listHistory);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: any[] = !_.isEmpty(listHistory)
    ? listHistory?.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getData = useCallback(async () => {
    return dispatch(getUserBalanceHistoryAction('debit'));
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
    return () => {
      dispatch(adminActions.resetDataReport());
    };
  }, [getData, dispatch]);

  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(listHistory);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* export to XLSX */
    writeFile(wb, 'list-add-balance.xlsx');
  }, [listHistory]);

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
                STT
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                User name
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Tên vật phẩm
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                giá tiền
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl bg-[#334155]">
            {flatMap(currentItems, (item, index) => (
              <tr key={item.history_id}>
                <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  <span className="text-center text-xs text-white">
                    {indexOfFirstItem + index + 1}
                  </span>
                </th>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  <span className="text-center text-xs text-white">{item?.order_user_id}</span>
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.item_name}
                </td>

                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {numberWithDot(item?.item_price || 0)}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {moment
                    .unix(Number(item?.order_input_date_timestamp) / 1000)
                    .utc()
                    .format('DD/MM/YYYY HH:mm:ss')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={listHistory?.length}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

export default memo(UserBalanceTable);

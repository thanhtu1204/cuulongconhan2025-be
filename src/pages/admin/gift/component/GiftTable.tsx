import _, { flatMap } from 'lodash';
import moment from 'moment/moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { utils, writeFile } from 'xlsx';

import ModalConfirm from '@/components/ModalConfirm';
import Pagination from '@/components/Pagination';
import ActionManagerGift from '@/pages/admin/gift/component/ActionManagerGift';
import { useAppDispatch, useAppSelector } from '@/stores';
import {
  activeGiftAction,
  deleteGiftAction,
  getListGiftCodeAction,
  inActiveGiftAction
} from '@/stores/admin';

const GiftTable = () => {
  const dispatch = useAppDispatch();

  const listGift = useAppSelector((state) => state.admin.listGift);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [idSelect, setIdSelect] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const itemsPerPage: number = 10;

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: any[] = !_.isEmpty(listGift)
    ? listGift?.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getData = useCallback(async () => {
    return dispatch(getListGiftCodeAction());
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

  // function onClickEdit(param: number | string) {
  //   window.open(`/admin/update-news/${param}`, '_blank');
  // }

  async function onClickHide(param: number | string) {
    const result: any = await dispatch(inActiveGiftAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Huỷ kích hoạt thành công!');
      setTimeout(() => {
        getData().then(() => {});
      }, 1500);
    }
  }

  async function onClickShow(param: number | string) {
    const result: any = await dispatch(activeGiftAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Kích hoạt thành công!');
      setTimeout(() => {
        getData().then(() => {});
      }, 1500);
    }
  }

  async function onClickDelete(param: number | string) {
    const result: any = await dispatch(deleteGiftAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Xoá tin thành công!');
      setTimeout(() => {
        getData().then(() => {});
      }, 500);
    }
  }

  function onConfirmDelete() {
    setOpenModal(false);
    if (idSelect) {
      onClickDelete(idSelect ?? '');
    }
  }

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(listGift);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* export to XLSX */
    writeFile(wb, 'list-gift-code.xlsx');
  }, [listGift]);

  return (
    <>
      <div className="relative z-0 mx-12 mb-6 flex w-full min-w-0 flex-col  break-words shadow-lg ">
        <div className="z-0 block w-full overflow-x-auto">
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

          <table className="z-0 w-full border-collapse items-center bg-transparent ">
            <thead>
              <tr>
                <th className=" whitespace-nowrap rounded-tl-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  ID
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  GiftCode
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Item code
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Active User
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Ngày sử dụng
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Hạn sử dụng
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Trạng thái
                </th>
                <th className=" whitespace-nowrap rounded-tr-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  hành động
                </th>
              </tr>
            </thead>
            <tbody className="rounded-xl bg-[#334155]">
              {flatMap(currentItems, (item) => (
                <tr key={item?.item_id}>
                  <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                    <span className="text-center text-xs text-white">{item?.item_id}</span>
                  </th>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item?.gift_code}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item?.item_code}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item?.active_user}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item?.update_at
                      ? moment(item?.update_at ?? '')
                          .utcOffset('+07:00')
                          .format('DD/MM/YYYY HH:mm:ss')
                      : 'Chưa sử dụng'}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {moment(item?.expried_date ?? '')
                      .utcOffset('+07:00')
                      .format('DD/MM/YYYY HH:mm:ss')}
                  </td>

                  <td
                    className={`whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  ${
                      item?.delete_flag ? 'text-red-600' : 'text-green-500'
                    }`}
                  >
                    {item?.delete_flag ? 'Không hoạt động' : 'Hoạt động'}
                  </td>

                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-[#008000]">
                    <span className="hidden">ManagerItem</span>
                    <ActionManagerGift
                      // onClickEdit={() => onClickEdit(item?.news_id ?? '')}
                      onClickHide={() => {
                        if (item?.delete_flag) {
                          toast.error('Gift code đang ở trạng thái không hoạt động');
                        } else {
                          onClickHide(item?.item_id ?? '').then(() => {});
                        }
                      }}
                      // onClickDelete={() => onClickDelete(item?.id ?? '')}
                      onClickDelete={() => {
                        setIdSelect(item?.item_id ?? 0);
                        setOpenModal(true);
                      }}
                      onClickShow={() => {
                        if (!item?.delete_flag) {
                          toast.error('Gift code đang ở trạng thái hoạt động');
                        } else {
                          onClickShow(item?.item_id ?? '').then(() => {});
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={listGift?.length}
            onPageChange={paginate}
          />
        </div>
      </div>
      <ModalConfirm
        title="Bạn có chắc chắn xoá sản phẩm?"
        isOpen={openModal}
        onConfirm={() => onConfirmDelete()}
        onClose={() => {
          setIdSelect(0);
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default memo(GiftTable);

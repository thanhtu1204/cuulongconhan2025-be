import { flatMap } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ModalConfirm from '@/components/ModalConfirm';
import MyLazyLoadedImage from '@/components/MyLazyLoadedImage';
import Pagination from '@/components/Pagination';
import ActionManagerItem from '@/pages/admin/shop/component/ActionManagerItem';
import itemDefault from '@/public/assets/images/webshop/item_2213227.gif';
import { useAppDispatch, useAppSelector } from '@/stores';
import { deleteItemAction, getListProductConfigAction } from '@/stores/admin';
import { numberWithCommas } from '@/utils/utils';

const ItemTable = () => {
  const dispatch = useAppDispatch();

  const listProductFull = useAppSelector((state) => state.admin.listProductFull);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [idSelect, setIdSelect] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const itemsPerPage: number = 10;

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: any[] = listProductFull.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getData = useCallback(async () => {
    return dispatch(getListProductConfigAction());
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

  // function onClickEdit(param: number | string) {
  //   window.open(`/admin/update-news/${param}`, '_blank');
  // }

  // async function onClickHide(param: number | string) {
  //   const result: any = await dispatch(hideItemAction(param as string)).unwrap();
  //   if (result?.status === 200) {
  //     toast.success('Ẩn vật phẩm thành công!');
  //     setTimeout(() => {
  //       getData().then(() => {});
  //     }, 1500);
  //   }
  // }
  //
  // async function onClickShow(param: number | string) {
  //   const result: any = await dispatch(showItemAction(param as string)).unwrap();
  //   if (result?.status === 200) {
  //     toast.success('Hiển thị vật phẩm thành công!');
  //     setTimeout(() => {
  //       getData().then(() => {});
  //     }, 1500);
  //   }
  // }

  async function onClickDelete(param: number | string) {
    const result: any = await dispatch(deleteItemAction(param as string)).unwrap();
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

  return (
    <>
      <div className="relative z-0 mx-12 mb-6 flex w-full min-w-0 flex-col  break-words shadow-lg ">
        <div className="z-0 block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="z-0 w-full border-collapse items-center bg-transparent ">
            <thead>
              <tr>
                <th className=" whitespace-nowrap rounded-tl-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  ID
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Hình ảnh
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Tên vật phẩm
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Mô tả
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Đơn giá
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
                <tr key={item.seq}>
                  <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                    <span className="text-center text-xs text-white">{item?.seq}</span>
                  </th>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    <MyLazyLoadedImage
                      src={item?.item_image || itemDefault.src}
                      className="h-8 w-8"
                      alt="Logo"
                    />
                  </td>
                  <td className="max-w-[100px] whitespace-pre-wrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item.item_name}
                  </td>
                  <td className="max-w-[200px] whitespace-pre-wrap break-words border-x-0 border-t-0 p-4 px-6 align-middle text-xs text-white">
                    {item.item_description}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {numberWithCommas(Number(item?.item_price))} KNB
                  </td>

                  <td
                    className={`whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  ${
                      item?.item_status !== 2 ? 'text-red-600' : 'text-green-500'
                    }`}
                  >
                    {item?.item_status !== 2 ? 'Ẩn' : 'Đang bán'}
                  </td>

                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-[#008000]">
                    <span className="hidden">ManagerItem</span>
                    <ActionManagerItem
                      // onClickEdit={() => onClickEdit(item?.news_id ?? '')}
                      // onClickHide={() => {
                      //   if (item?.delete_flag) {
                      //     toast.error('Vật phẩm đang ở trạng thái ngừng bán');
                      //   } else {
                      //     onClickHide(item?.seq ?? '').then(() => {});
                      //   }
                      // }}
                      // onClickDelete={() => onClickDelete(item?.id ?? '')}
                      onClickDelete={() => {
                        setIdSelect(item?.seq ?? 0);
                        setOpenModal(true);
                      }}
                      // onClickShow={() => {
                      //   if (!item?.delete_flag) {
                      //     toast.error('Vật phẩm đang ở trạng thái bán!');
                      //   } else {
                      //     onClickShow(item?.seq ?? '').then(() => {});
                      //   }
                      // }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={listProductFull.length}
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

export default memo(ItemTable);

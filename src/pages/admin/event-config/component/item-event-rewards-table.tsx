import { flatMap } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ModalConfirm from '@/components/ModalConfirm';
import MyLazyLoadedImage from '@/components/MyLazyLoadedImage';
import Pagination from '@/components/Pagination';
import ActionManagerEvent from '@/pages/admin/event-config/component/ActionManagerEvent';
import itemDefault from '@/public/assets/images/webshop/item_2213227.gif';
import { useAppDispatch, useAppSelector } from '@/stores';
import { deleteItemEventRewardsAction, getAllItemEventRewardsAction } from '@/stores/admin';

const ItemEventRewardsTable = () => {
  const dispatch = useAppDispatch();

  const listItemEventRewards = useAppSelector((state) => state.admin.listItemEventRewards);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [idSelect, setIdSelect] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const itemsPerPage: number = 10;

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: any[] = listItemEventRewards.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getData = useCallback(async () => {
    return dispatch(getAllItemEventRewardsAction());
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
    const result: any = await dispatch(deleteItemEventRewardsAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Xoá mốc vật phẩm thành công!');
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
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Tên sự kiện
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Hình ảnh vật phẩm
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Tên vật phẩm
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Item code quà
                </th>
                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Mốc nhận quà
                </th>

                <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Thông tin vật phẩm
                </th>

                <th className=" whitespace-nowrap rounded-tr-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-[#E2E8F0]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="rounded-xl bg-[#334155]">
              {flatMap(currentItems, (item) => (
                <tr key={item?.reward_id}>
                  <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                    <span className="text-center text-xs text-white">{item.event_name}</span>
                  </th>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    <MyLazyLoadedImage
                      src={item?.reward_image || itemDefault.src}
                      className="h-8 w-8"
                      alt="Logo"
                    />
                  </td>
                  <td className="max-w-[100px] whitespace-pre-wrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item.reward_name}
                  </td>
                  <td className="max-w-[200px] whitespace-pre-wrap break-words border-x-0 border-t-0 p-4 px-6 align-middle text-xs text-white">
                    {item.reward_item_code}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item.required_points}
                  </td>
                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                    {item.reward_description}
                  </td>

                  <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-[#008000]">
                    <span className="hidden">ManagerItem</span>
                    <ActionManagerEvent
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
                        setIdSelect(item?.reward_id ?? 0);
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
            totalPages={listItemEventRewards.length}
            onPageChange={paginate}
          />
        </div>
      </div>
      <ModalConfirm
        title="Bạn có chắc chắn vật phẩm phẩm?"
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

export default memo(ItemEventRewardsTable);

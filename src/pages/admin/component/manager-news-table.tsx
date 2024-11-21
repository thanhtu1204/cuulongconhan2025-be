import { flatMap } from 'lodash';
import moment from 'moment';
import React, { memo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import ActionManagerNews from '@/pages/admin/component/ActionManagerNews';
import { useAppDispatch, useAppSelector } from '@/stores';
import {
  deleteNewsAction,
  getListNewsConfigAction,
  hideNewsAction,
  showNewsAction
} from '@/stores/admin';

const NewsListTable = () => {
  const dispatch = useAppDispatch();

  const listNewsFull = useAppSelector((state) => state.admin.listNewsFull);

  const getData = useCallback(async () => {
    return dispatch(getListNewsConfigAction());
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

  // function onClickEdit(param: number | string) {
  //   window.open(`/admin/update-news/${param}`, '_blank');
  // }

  async function onClickHide(param: number | string) {
    const result: any = await dispatch(hideNewsAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Ẩn tin thành công!');
      setTimeout(() => {
        getData().then(() => {});
      }, 1500);
    }
  }

  async function onClickShow(param: number | string) {
    const result: any = await dispatch(showNewsAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Hiện tin thành công!');
      setTimeout(() => {
        getData().then(() => {});
      }, 1500);
    }
  }

  async function onClickDelete(param: number | string) {
    const result: any = await dispatch(deleteNewsAction(param as string)).unwrap();
    if (result?.status === 200) {
      toast.success('Xoá tin thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  return (
    <div className="relative z-0 mx-12 mb-6 flex w-full min-w-0 flex-col  break-words shadow-lg ">
      <div className="z-0 block w-full overflow-x-auto">
        {/* Projects table */}
        <table className="z-0 w-full border-collapse items-center bg-transparent ">
          <thead>
            <tr>
              <th className=" whitespace-nowrap rounded-tl-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                ID
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Tiêu đề bài viết
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Ngày tạo
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Loại bài viết
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Trạng thái
              </th>
              <th className=" whitespace-nowrap rounded-tr-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                hành động
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl bg-[#334155]">
            {flatMap(listNewsFull, (item) => (
              <tr key={item._id}>
                <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  <span className="text-center text-xs text-white">{item?._id}</span>
                </th>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.title?.vi}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {moment(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.type === 1 && (
                    <span className="px-4 py-2 text-base font-bold  hover:text-[#d51400]">
                      Tin tức
                    </span>
                  )}

                  {item?.type === 2 && (
                    <span className="px-4 py-2 text-base font-bold  hover:text-[#d51400]">
                      Sự kiện
                    </span>
                  )}

                  {item?.type === 3 && (
                    <span
                      className={` px-4 py-2  text-base font-bold
                      hover:text-[#d51400]`}
                    >
                      Thông báo
                    </span>
                  )}
                </td>

                <td
                  className={`whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  ${
                    item?.delete_flag ? 'text-red-600' : 'text-green-500'
                  }`}
                >
                  {item?.delete_flag ? 'Ẩn tin' : 'Hiện tin'}
                </td>

                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-[#008000]">
                  <span className="hidden">ManagerNews</span>

                  <ActionManagerNews
                    // onClickEdit={() => onClickEdit(item?.news_id ?? '')}
                    onClickHide={() => {
                      if (item?.delete_flag) {
                        toast.error('Bài đăng đang ở trạng thái ẩn!');
                      } else {
                        onClickHide(item?._id ?? '').then(() => {});
                      }
                    }}
                    onClickDelete={() => onClickDelete(item?._id ?? '')}
                    onClickShow={() => {
                      if (!item?.delete_flag) {
                        toast.error('Bài đăng đang ở trạng thái hiển thị!');
                      } else {
                        onClickShow(item?._id ?? '').then(() => {});
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(NewsListTable);

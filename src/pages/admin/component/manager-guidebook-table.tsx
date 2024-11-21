import { flatMap } from 'lodash';
import React, { memo } from 'react';
import { toast } from 'react-toastify';

import ActionManagerGuideBook from '@/pages/admin/component/ActionManagerGuideBook';
import { useAppDispatch } from '@/stores';
import { deleteGuideBookAction } from '@/stores/admin';

interface DataProp {
  dataTable: any[];
}

const GuideBookTable = ({ dataTable }: DataProp) => {
  const dispatch = useAppDispatch();

  async function onClickDelete(param: string) {
    const result: any = await dispatch(deleteGuideBookAction(param as string)).unwrap();
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
                STT
              </th>
              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Tiêu đề bài viết
              </th>

              <th className="whitespace-nowrap border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                Loại bài viết
              </th>
              <th className=" whitespace-nowrap rounded-tr-xl border border-x-0 border-solid border-[#64748B] bg-[#475569] px-6 py-3 text-left align-middle text-xl font-semibold uppercase text-[#E2E8F0]">
                hành động
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl bg-[#334155]">
            {flatMap(dataTable, (item, index) => (
              <tr key={item.id}>
                <th className=" items-center whitespace-nowrap border-x-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  <span className="text-center text-xs text-white">{index + 1}</span>
                </th>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.title}
                </td>
                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-white">
                  {item?.type === '0' && (
                    <span className="px-4 py-2 text-base font-bold  hover:text-[#d51400]">
                      Tân thủ
                    </span>
                  )}

                  {item?.type === '1' && (
                    <span className="px-4 py-2 text-base font-bold  hover:text-[#d51400]">
                      Nhiệm vụ đế long hành
                    </span>
                  )}

                  {item?.type === '2' && (
                    <span
                      className={` px-4 py-2  text-base font-bold
                      hover:text-[#d51400]`}
                    >
                      Phó bản (quyết)
                    </span>
                  )}

                  {item?.type === '3' && (
                    <span
                      className={` px-4 py-2  text-base font-bold
                      hover:text-[#d51400]`}
                    >
                      Trang bị
                    </span>
                  )}
                  {item?.type === '4' && (
                    <span
                      className={` px-4 py-2  text-base font-bold
                      hover:text-[#d51400]`}
                    >
                      Tính năng mới
                    </span>
                  )}
                </td>

                <td className="whitespace-nowrap border-x-0 border-t-0 p-4 px-6 align-middle text-xs  text-[#008000]">
                  <span className="hidden">ManagerNews</span>
                  <ActionManagerGuideBook onClickDelete={() => onClickDelete(item?.id ?? '')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(GuideBookTable);

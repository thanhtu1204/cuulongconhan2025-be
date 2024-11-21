import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, memo } from 'react';

interface IAction {
  // onClickEdit?: () => void;
  // onClickHide: () => void;
  onClickDelete: () => void;
  // onClickShow: () => void;
}

function ActionManagerEvent({ onClickDelete }: IAction) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          as="button" // Sửa đổi thành thẻ button
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-cyan-400"
        >
          Action
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-400"
          >
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 focus:outline-none">
          <div className="py-1">
            {/* <Menu.Item> */}
            {/*  {({ active }) => ( */}
            {/*    <button */}
            {/*      onClick={onClickEdit} */}
            {/*      className={ */}
            {/*        active */}
            {/*          ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm' */}
            {/*          : 'text-gray-700 block px-4 py-2 text-sm' */}
            {/*      } */}
            {/*    > */}
            {/*      Sửa tin */}
            {/*    </button> */}
            {/*  )} */}
            {/* </Menu.Item> */}
            {/* <Menu.Item> */}
            {/*  {({ active }) => ( */}
            {/*    <button */}
            {/*      type="button" */}
            {/*      onClick={onClickHide} */}
            {/*      className={ */}
            {/*        active */}
            {/*          ? 'block w-full bg-blue-500 px-4 py-2 text-start text-sm text-gray-900' */}
            {/*          : ' block w-full px-4 py-2 text-start text-sm text-gray-700' */}
            {/*      } */}
            {/*    > */}
            {/*      <span>Dừng bán vật phẩm</span> */}
            {/*    </button> */}
            {/*  )} */}
            {/* </Menu.Item> */}
            {/* <Menu.Item> */}
            {/*  {({ active }) => ( */}
            {/*    <button */}
            {/*      type="button" */}
            {/*      onClick={onClickShow} */}
            {/*      className={ */}
            {/*        active */}
            {/*          ? 'block w-full bg-blue-500 px-4 py-2 text-start text-sm text-gray-900' */}
            {/*          : 'block w-full px-4 py-2 text-start text-sm text-gray-700' */}
            {/*      } */}
            {/*    > */}
            {/*      <span>Bán Vật phẩm</span> */}
            {/*    </button> */}
            {/*  )} */}
            {/* </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={onClickDelete}
                  className={
                    active
                      ? 'block w-full  bg-blue-500 px-4 py-2 text-start text-sm text-gray-900'
                      : 'block w-full px-4 py-2 text-start text-sm text-gray-700'
                  }
                >
                  <span>Xoá</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default memo(ActionManagerEvent);

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { useAppDispatch } from '@/stores';
import { authenActions } from '@/stores/authentication';

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const clearData = useCallback(async () => {
    dispatch(authenActions.logout());
  }, [dispatch]);

  function onClickLogout() {
    clearData().then(() => {
      router.push('/home');
    });
  }

  return (
    <div>
      <nav className="bg-blueGray-800 relative z-10 mt-20 flex flex-wrap items-center justify-between px-6 py-4 shadow-xl md:fixed md:inset-y-0 md:left-0 md:block md:w-64 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch">
          <div className="absolute inset-x-0 top-0 z-40 h-auto flex-1 items-center overflow-y-auto overflow-x-hidden rounded shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:opacity-100 md:shadow-none">
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            {/* <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline"> */}
            {/*  Cửu long tranh bá */}
            {/* </h6> */}
            {/* Navigation */}

            <ul className="flex list-none flex-col md:min-w-full md:flex-col">
              <li className="items-center">
                <Link href="/user/dashboard">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/dashboard') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/dashboard') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Thông tin tài khoản
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/user/deposit">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/deposit') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/deposit') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Auto nạp tiền
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/user/gift-code">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/gift-code') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/gift-code') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Gift code
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/user/history">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/history') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/history') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Lịch sử nạp tiền
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/user/change-pass">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/change-pass') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/change-pass') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Đổi mật khẩu
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/user/loyalty-point">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/loyalty-point') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/loyalty-point') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />{' '}
                    Tích tiêu nhận quà
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/user/rename-char">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/user/rename-char') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/user/rename-char') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Đổi tên nhân vật
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <button type="button" onClick={onClickLogout}>
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/maps') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` mr-2 text-sm ${
                        router.pathname.indexOf('/admin/maps') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Đăng xuất
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

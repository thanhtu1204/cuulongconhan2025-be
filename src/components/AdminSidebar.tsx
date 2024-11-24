import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminSidebar() {
  const router = useRouter();

  function onClickLogout() {}

  return (
    <div>
      <nav className="bg-blueGray-800 relative z-10 flex flex-wrap items-center justify-between px-6 py-4 shadow-xl md:fixed md:inset-y-0 md:left-0 md:block md:w-64 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch">
          <div className="absolute inset-x-0 top-0 z-40 h-auto flex-1 items-center overflow-y-auto overflow-x-hidden rounded shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:opacity-100 md:shadow-none">
            <hr className="my-4 md:min-w-full" />
            <ul className="flex list-none flex-col md:min-w-full md:flex-col">
              <li className="items-center">
                <Link href="/admin/dashboard">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/dashboard') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/dashboard') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Dashboard
                  </span>
                </Link>
              </li>
              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Tin tức
              </span>
              <li className="items-center">
                <Link href="/admin/add-news">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/add-news') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/add-news') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Đăng tin mới
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/manager-news">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/manager-news') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/manager-news') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý tin tức
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Kỳ trân các
              </span>

              <li className="items-center">
                <Link href="/admin/shop/add-item">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/shop/add-item') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/shop/add-item') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Thêm vật phẩm mới
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/shop/manager-item">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/shop/manager-item') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/shop/manager-item') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý vật phẩm
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Long ngân các
              </span>

              <li className="items-center">
                <Link href="/admin/shop-bonus/add-item">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/shop-bonus/add-item') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/shop-bonus/add-item') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Thêm vật phẩm mới
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/shop-bonus/manager-item">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/shop-bonus/manager-item') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/shop-bonus/manager-item') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý vật phẩm
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Gift code
              </span>
              <li className="items-center">
                <Link href="/admin/gift/create-gift">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/gift/create-gift') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/gift/create-gift') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Tạo mới Gift code
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/gift/manager-gift">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/gift/manager-gift') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/gift/manager-gift') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý Gift code
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Cẩm nang
              </span>
              <li className="items-center">
                <Link href="/admin/guidebook">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/guidebook') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/guidebook') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Tạo mới bài viết hướng dẫn
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/guidebook/manager-guidebook">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/manager-guidebook') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/manager-guidebook') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý bài viết cẩm nang
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Cấu hình
              </span>
              <li className="items-center">
                <Link href="/admin/config-dowload">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/config-dowload') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/config-dowload') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Cấu hình link tải game
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/promotion-config">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/promotion-config') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/promotion-config') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Cấu hình khuyến mãi nạp tiền
                  </span>
                </Link>
              </li>
              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Tính năng nạp-tiêu xu
              </span>

              <li className="items-center">
                <Link href="/admin/event-config/create-event">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/event-config/create-event') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/event-config/create-event') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Cấu hình sự kiện nạp - tiêu
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/event-config/manager-event-rewards">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/event-config/manager-event-rewards') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/event-config/manager-event-rewards') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý sự kiện nạp-tiêu
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/event-config/create-item-event">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/event-config/create-item-event') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/event-config/create-item-event') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Cấu hình vật phẩm sự kiện nạp - tiêu
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/event-config/manager-item-event-rewards">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/event-config/manager-item-event-rewards') !==
                      -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf(
                          '/admin/event-config/manager-item-event-rewards'
                        ) !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý vật phẩm sự kiện nạp - tiêu
                  </span>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              {/* Heading */}
              <span className="mr-2 block pb-4 pt-1 text-xs font-bold uppercase text-cyan-400 no-underline md:min-w-full">
                Tính năng khác
              </span>
              <li className="items-center">
                <Link href="/admin/add-money">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/add-money') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/add-money') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Nạp tiền vào tk chính cho user
                  </span>
                </Link>
              </li>

              <span className="mx-4" />

              <li className="items-center">
                <Link href="/admin/add-bonus-money">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/add-bonus-money') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/add-bonus-money') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Nạp tiền vào tk khuyễn mãi cho user
                  </span>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/report-add-balance">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/report-add-balance') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/report-add-balance') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Thống kê nạp xu
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/report-user-balance">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/report-user-balance') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/report-user-balance') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Thống kê tiêu xu
                  </span>
                </Link>
              </li>
              <li className="items-center">
                <Link href="/admin/manager-event">
                  <span
                    className={`block py-3 text-xs font-bold uppercase ${
                      router.pathname.indexOf('/admin/manager-event') !== -1
                        ? 'text-yellow hover:text-red-700'
                        : 'text-white hover:text-yellow'
                    }`}
                  >
                    <i
                      className={` text-sm ${
                        router.pathname.indexOf('/admin/manager-event') !== -1
                          ? 'text-yellow hover:text-red-700'
                          : 'text-white hover:text-yellow'
                      }`}
                    />
                    Quản lý sự kiện
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
                      className={` text-sm ${
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

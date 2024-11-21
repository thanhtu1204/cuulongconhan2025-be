import { Popover, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback } from 'react';

// @ts-ignore
import userIco from '@/public/assets/images/user.ico';
import { useAppDispatch } from '@/stores';
import { authenActions } from '@/stores/authentication';

export default function UserButton() {
  // const { user } = useAppSelector((state) => state.authen);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onClickLogOut = useCallback(async () => {
    dispatch(authenActions.logout());
    await router.replace('/home');
  }, [dispatch, router]);

  return (
    <div className=" top-16 w-full max-w-sm px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`${
                open ? 'text-white' : 'text-white/90'
              } group inline-flex items-center rounded-3xl bg-[#F6E4C2] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <img className=" h-12 w-12 rounded-full" src={userIco.src} alt="err" />
              {/* <div className="max-w-[300px] overflow-hidden truncate px-1 pl-2 text-base font-bold text-yellow "> */}
              {/*  {user.displayName} */}
              {/*  <div className="flex flex-row items-center"> */}
              {/*    <svg */}
              {/*      xmlns="http://www.w3.org/2000/svg" */}
              {/*      fill="none" */}
              {/*      viewBox="0 0 24 24" */}
              {/*      strokeWidth={1.5} */}
              {/*      stroke="currentColor" */}
              {/*      className="h-4 w-4" */}
              {/*    > */}
              {/*      <path */}
              {/*        strokeLinecap="round" */}
              {/*        strokeLinejoin="round" */}
              {/*        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" */}
              {/*      /> */}
              {/*    </svg> */}
              {/*    <span className="ml-1"> {numberWithCommas(Number(user.balance))}</span> */}
              {/*  </div> */}
              {/* </div> */}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 px-4 sm:px-0 lg:max-w-xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                    <Link
                      key="manage-user"
                      href="/user/dashboard"
                      className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                        <IconOne aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Quản lý tài khoản</p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      key="logout"
                      onClick={onClickLogOut}
                      className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                        <IconOne aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Đăng xuất</p>
                      </div>
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

function IconOne() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

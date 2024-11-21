import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import btnLogin from '@/public/assets/images/auth/btn-login.png';
import background from '@/public/assets/images/auth/lg_bg.jpg';
import rightBg from '@/public/assets/images/auth/login-img.jpg';
import coNhan from '@/public/assets/images/cuulongcn.jpg';
import { useAppDispatch, useAppSelector } from '@/stores';
import { adminActions, adminLoginAction } from '@/stores/admin';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(6, 'Tài khoản phải có ít nhất 6 ký tự')
    .max(50, 'Tài khoản không được vượt quá 50 ký tự')
    .required('Tài khoản là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
    .required('Mật khẩu là bắt buộc')
});

interface FormData {
  username: string;
  password: string;
}

const Login: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading } = useAppSelector((state) => state.admin);
  const [showPass, setShowPass] = useState<boolean>(false);
  const initialValues = {
    username: '',
    password: ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const result: any = await dispatch(adminLoginAction(values)).unwrap();
    if (result) {
      toast.success('Đăng nhập thành công!');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    }
    formikHelpers.resetForm();
    formikHelpers.setSubmitting(false);
  };

  const divVariants = {
    hidden: { opacity: 0, y: 50 }, // Bắt đầu ẩn đi và ở dưới
    visible: { opacity: 1, y: 0 } // Khi hiển thị, dịch chuyển lên và trở nên rõ ràng
  };

  const clearData = useCallback(async () => {
    dispatch(adminActions.clear());
  }, [dispatch]);

  useEffect(() => {
    clearData().then(() => {});
  }, [clearData]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={divVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="box-border flex h-screen items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="container flex h-full items-center justify-center rounded p-10">
        <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <motion.div className="w-full">
            <motion.div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <motion.div className=" lg:flex lg:flex-wrap">
                <motion.div className="px-4 md:px-0 lg:w-6/12">
                  <motion.div className="mx-2 p-2">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <Image src={coNhan} className="mx-auto w-28" alt="icon-y" />
                      <h4 className="mb-2 mt-1 pb-1 text-center text-xl font-semibold">
                        Cửu long cố nhân xin chào!
                      </h4>
                    </motion.div>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={LoginSchema}
                      onSubmit={handleSubmit}
                    >
                      <Form className=" flex w-full flex-col bg-white p-4">
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="w-full"
                        >
                          <div className="my-2 block">
                            <span className="text-xl font-bold text-yellow">Tài khoản</span>
                          </div>
                          <Field
                            className="h-14 w-full rounded text-xl"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nhập tài khoản"
                            required
                            autoComplete="on"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="text-xl text-red-500"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="my-2 block">
                            <span className=" text-xl font-bold text-yellow">Mật khẩu</span>
                          </div>
                          <div className="relative flex flex-row">
                            <Field
                              className="h-14 w-full rounded text-xl"
                              type={showPass ? 'text' : 'password'}
                              id="password"
                              name="password"
                              placeholder="Nhập mật khẩu"
                              required
                              autoComplete="on"
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-4"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-6 w-6 stroke-gray-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-6 w-6 stroke-gray-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-xl text-red-500"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.9 }}
                        >
                          <button
                            className="flex w-full items-center justify-center pt-4"
                            disabled={loading}
                            type="submit"
                          >
                            <div
                              className="button-auth-login"
                              style={{ backgroundImage: `url(${btnLogin.src})` }}
                            />
                            <span className="hidden">image</span>
                          </button>
                          <div className="border-b-2 border-dashed border-blue-500 pt-4" />
                        </motion.div>
                      </Form>
                    </Formik>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ x: { duration: 0.5 }, opacity: { duration: 2.5 } }}
                  className="flex w-full items-center justify-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none "
                >
                  <Image src={rightBg} className="h-full w-full object-cover" alt="icon-y" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

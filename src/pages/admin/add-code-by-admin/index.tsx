import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch } from '@/stores';
import { addCodeAction } from '@/stores/admin';

const AddFundSchema = Yup.object().shape({
  userName: Yup.string().required('userName không được để trống')
});

interface FormData {
  userName: string;
  code: string;
}

export default function AddCodeUser() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const result: any = await dispatch(addCodeAction({ ...values })).unwrap();

    if (result?.status === 200) {
      toast.success('Add code thành công!');
      formikHelpers.resetForm();

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    }
    formikHelpers.setSubmitting(false);
  };

  const initialAddFundValues = {
    userName: '',
    code: ''
  };

  return (
    <AdminLayout>
      <motion.div
        className="ml-64"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]">
          <span className="text-5xl font-bold text-cyan-400">Add itemcode cho User</span>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="box-border flex h-fit w-full items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
        >
          <div className="mx-12 flex h-full w-full items-center justify-center text-neutral-800 dark:text-neutral-200">
            <Formik
              initialValues={initialAddFundValues}
              validationSchema={AddFundSchema}
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
                    <span className="text-xl font-bold text-cyan-400">Tên user cần add</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Nhập tên user"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="userName" component="div" className="text-xl text-red-500" />
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-cyan-400">
                      Nhập mã code quà tặng (không phải item code vật phẩm)
                    </span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="code"
                    name="code"
                    placeholder="Nhập mã code"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="code" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="flex w-full items-center justify-center pt-12"
                >
                  <button
                    className=" rounded border border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    type="submit"
                  >
                    <span className="text-base font-bold">Thực thi</span>
                  </button>
                  <div className="border-b-2 border-dashed border-blue-500 pt-4" />
                </motion.div>
              </Form>
            </Formik>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

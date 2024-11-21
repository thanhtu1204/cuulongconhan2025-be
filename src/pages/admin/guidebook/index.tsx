import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addGuideBookAction } from '@/stores/admin';

const CKEditorField = dynamic(() => import('@/components/CKEditorField'), { ssr: false });
const MAX_STRING_LENGTH = 15.5 * 1024 * 1024; // Độ dài giới hạn là 15.5 MB

const GuideBookSchema = Yup.object().shape({
  title: Yup.string()
    .min(6, 'Tiêu đề có ít nhất 6 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự')
    .required('Tiêu đề là bắt buộc'),
  type: Yup.string().required('Loại bài viết là bắt buộc'),
  contentHtml: Yup.string().test(
    'contentHtmlSize',
    'Data size must be less than 15.5 MB',
    function (value) {
      if (!value) {
        return true; // Không cần kiểm tra nếu giá trị không tồn tại
      }

      // Kiểm tra độ dài của chuỗi
      const isValid = value.length <= MAX_STRING_LENGTH;

      if (!isValid) {
        // Thông báo lỗi kiểm tra tùy chỉnh
        return this.createError({
          path: 'contentHtml',
          message: 'Kích thước bài viết không được quá 15.5 MB hãy reisze lại ảnh'
        } as any); // Thêm chú thích kiểu
      }

      return true;
    }
  )
});

interface FormData {
  title: string;
  type: string;
  contentHtml: string;
}

export default function AddGuideBook() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);

  const initialValues = {
    title: '',
    type: '0',
    contentHtml: ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      title: values.title,
      type: values.type,
      contentHtml: values.contentHtml
    };

    const result: any = await dispatch(addGuideBookAction(payload)).unwrap();

    if (result?.status === 200) {
      formikHelpers.resetForm();
      toast.success('Thêm bài viết thành công!');
    }
    formikHelpers.setSubmitting(false);
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
          <span className="text-5xl font-bold text-yellow">Thêm bài viết hướng dẫn mới</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Vui lòng nhập thông tin cho bài viết mới
          </span>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="box-border flex h-fit w-full items-center justify-center bg-cover bg-no-repeat pb-4 opacity-100 transition-opacity duration-500"
        >
          <div className="mx-12 flex h-full w-full items-center justify-center text-neutral-800 dark:text-neutral-200">
            <Formik
              initialValues={initialValues}
              validationSchema={GuideBookSchema}
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
                    <span className="text-xl font-bold text-yellow">Tiêu đề</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Nhập tiêu đề"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="title" component="div" className="text-xl text-red-500" />
                </motion.div>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="my-2 block">
                    <span className=" text-xl font-bold text-yellow">Loại bài viết</span>
                  </div>
                  <div className="relative flex flex-row">
                    <Field as="select" className="p-2 text-base font-bold" name="type" id="type">
                      <option className="p-2 text-base font-bold" value="0">
                        Tân thủ
                      </option>
                      <option className="p-2 text-base font-bold" value="1">
                        Nhiệm vụ đế long hành
                      </option>
                      <option className="p-2 text-base font-bold" value="2">
                        Phó bản (quyết)
                      </option>
                      <option className="p-2 text-base font-bold" value="3">
                        Trang bị
                      </option>
                      <option className="p-2 text-base font-bold" value="4">
                        Tính năng mới
                      </option>
                    </Field>
                  </div>
                  <ErrorMessage name="type" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">
                      Nội dung chi tiết bài viết
                    </span>
                  </div>
                  <CKEditorField name="contentHtml" label="Nội dung chi tiết" />

                  <ErrorMessage
                    name="contentHtml"
                    component="div"
                    className="text-xl text-red-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="flex w-full items-center justify-center pt-12"
                >
                  <button
                    className=" rounded border border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    disabled={loading}
                    type="submit"
                  >
                    <span className="text-base font-bold">Đăng bài</span>
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

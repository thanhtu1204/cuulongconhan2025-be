import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addNewsAction } from '@/stores/admin';

const CKEditorField = dynamic(() => import('@/components/CKEditorField'), { ssr: false });
const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

const MAX_FILE_SIZE_MB = 3;

const NewsSchema = Yup.object().shape({
  titleVi: Yup.string()
    .min(6, 'Tiêu đề tiếng việt có ít nhất 6 ký tự')
    .max(100, 'Tiêu đề tiếng việt không được vượt quá 100 ký tự')
    .required('Tiêu đề tiếng việt là bắt buộc'),
  titleEn: Yup.string()
    .min(6, 'Tiêu đề tiếng anh có ít nhất 6 ký tự')
    .max(100, 'Tiêu đề tiếng anh không được vượt quá 100 ký tự')
    .required('Tiêu đề tiếng anh là bắt buộc'),
  type: Yup.string().required('Loại bài viết là bắt buộc'),
  imageVi: Yup.mixed<File>()
    .required('Ảnh tiếng việt là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 3MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  imageEn: Yup.mixed<File>()
    .required('Ảnh tiếng anh là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 3MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  description: Yup.string().required('Mô tả là bắt buộc'),
  contentVi: Yup.string().required('Nội dung bài viết tiếng việt là bắt buộc'),
  contentEn: Yup.string().required('Nội dung bài viết  tiếng anh là bắt buộc')
});

interface FormData {
  titleVi: string;
  titleEn: string;
  type: string;
  imageVi: File | null;
  imageEn: File | null;
  description: string;
  contentVi: string;
  contentEn: string;
}

export default function AddNews() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);

  const initialNewsValues = {
    titleVi: '',
    titleEn: '',
    type: '1',
    imageVi: null as File | null,
    imageEn: null as File | null,
    description: '',
    contentVi: '',
    contentEn: ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      ...values
    };

    const result: any = await dispatch(addNewsAction(payload)).unwrap();

    if (result?.status === 200) {
      formikHelpers.resetForm();
      toast.success('Thêm tin thành công!');
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
          <span className="text-5xl font-bold text-yellow">Thêm tin mới</span>
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
              initialValues={initialNewsValues}
              validationSchema={NewsSchema}
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
                    <span className="text-xl font-bold text-yellow">Tiêu đề tiếng việt</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="titleVi"
                    name="titleVi"
                    placeholder="Nhập tiêu đề tiếng việt"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="titleVi" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Tiêu đề tiếng anh</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="titleEn"
                    name="titleEn"
                    placeholder="Nhập tiêu đề tiếng anh"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="titleEn" component="div" className="text-xl text-red-500" />
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
                      <option className="p-2 text-base font-bold" value="1">
                        Tin tức
                      </option>
                      <option className="p-2 text-base font-bold" value="2">
                        Sự Kiện
                      </option>
                      <option className="p-2 text-base font-bold" value="3">
                        Thông Báo
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
                    <span className="text-xl font-bold text-yellow">Ảnh title tiếng việt</span>
                  </div>

                  <ImageUpload name="imageVi" />

                  <ErrorMessage name="imageVi" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ảnh title tiếng anh</span>
                  </div>

                  <ImageUpload name="imageEn" />

                  <ErrorMessage name="imageEn" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Mô tả chủ đề</span>
                  </div>
                  <Field
                    className="h-24 w-full rounded text-xl"
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Nhập mô tả chủ đề"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-xl text-red-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">
                      Nội dung tiếng việt chi tiết
                    </span>
                  </div>
                  <CKEditorField name="contentVi" label="Nội dung chi tiết" />

                  <ErrorMessage name="contentVi" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">
                      Nội dung tiếng anh chi tiết
                    </span>
                  </div>
                  <CKEditorField name="contentEn" label="Nội dung chi tiết" />

                  <ErrorMessage name="contentEn" component="div" className="text-xl text-red-500" />
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
                    <span className="text-base font-bold">Đăng tin</span>
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

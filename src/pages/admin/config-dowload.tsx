import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addConfigLinkGameAction } from '@/stores/admin';
import { getLinkGameAction } from '@/stores/home';

const ConfigSchema = Yup.object().shape({
  linkEn: Yup.string().required('Link tải game là bắt buộc'),
  linkVi: Yup.string().required('Link tải game là bắt buộc')
});

interface FormData {
  linkEn: string;
  linkVi: string;
}

export default function AddNews() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);
  const linkDownLoad = useAppSelector((state) => state.home.linkDownLoad?.link);
  const initialConfigValues = {
    linkEn: '',
    linkVi: ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      linkEn: values.linkEn,
      linkVi: values.linkVi
    };
    const result: any = await dispatch(addConfigLinkGameAction(payload)).unwrap();

    if (result?.status === 200) {
      toast.success('Cấu hình thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    formikHelpers.setSubmitting(false);
  };

  const getData = useCallback(async () => {
    return dispatch(getLinkGameAction());
  }, [dispatch]);

  useEffect(() => {
    getData().then(() => {});
  }, [getData]);

  return (
    <AdminLayout>
      <motion.div
        className="ml-64"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="flex w-full flex-row items-center  justify-center bg-[#3b5998]">
          <span className="text-5xl font-bold text-yellow">Cấu hình link tải game</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y px-8 py-4 text-center text-2xl text-black">
            Lưu ý : 1: Dùng tài khoản google để lưu ở driver tránh lộ những tài khoản google email
            của GM hay admin nên để là 9d tên server @gmail.com sau đó tải file lên google driver
            bằng chính tài khoản đó các bước lấy link : <br />
            Để lấy liên kết chia sẻ từ Google Drive, <br />
            bạn có thể thực hiện các bước sau:
            <br /> Chia sẻ tệp hoặc thư mục: Mở Google Drive và tìm đến tệp hoặc thư mục bạn muốn
            chia sẻ. Chuột phải vào tệp hoặc thư mục đó. Chọn &quot;Share&quot; (Chia sẻ) từ menu.{' '}
            <br />
            Chọn quyền truy cập: Trong cửa sổ chia sẻ, bạn có thể chọn quyền truy cập (ví dụ:
            &quot;Anyone with the link&quot; - &quot;Ai đó có liên kết&quot;). <br />
            Nếu bạn muốn người nhận có quyền xem, chỉnh sửa hoặc bình luận, hãy chọn tùy chọn phù
            hợp. <br />
            Tạo liên kết chia sẻ: Bạn sẽ thấy tùy chọn &quot;Copy link&quot; (Sao chép liên kết).
            Nhấn vào nút này để sao chép liên kết chia sẻ.
            <br />
            Sau đó dán vào ô input bên dưới!
            <br />
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
              initialValues={initialConfigValues}
              validationSchema={ConfigSchema}
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
                    <span className="text-xl font-bold text-yellow">Link tải game tiếng việt</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="linkVi"
                    name="linkVi"
                    placeholder="Nhập link tải game tiếng việt"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="linkEn" component="div" className="text-xl text-red-500" />
                </motion.div>

                <br />

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Link tải game tiếng anh</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="linkEn"
                    name="linkEn"
                    placeholder="Nhập link tải game tiếng anh"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="linkEn" component="div" className="text-xl text-red-500" />
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
                    <span className="text-base font-bold">Cập nhật</span>
                  </button>
                  <div className="border-b-2 border-dashed border-blue-500 pt-4" />
                </motion.div>
              </Form>
            </Formik>
          </div>
        </motion.div>
        <div className="flex w-full items-center justify-center ">
          <Link
            type="button"
            rel="noopener noreferrer"
            target="_blank"
            href={linkDownLoad?.vi || '/'}
          >
            <span> Link tiếng việt hiện tại : {linkDownLoad?.vi || ''}</span>
          </Link>
        </div>
        <div className="flex w-full items-center justify-center ">
          <br />
          <Link
            type="button"
            rel="noopener noreferrer"
            target="_blank"
            href={linkDownLoad?.en || '/'}
          >
            <span> Link tiếng anh hiện tại : {linkDownLoad?.en || ''}</span>
          </Link>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

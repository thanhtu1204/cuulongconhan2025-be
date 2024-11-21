import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useAppDispatch } from '@/stores';
import { addNewsAction } from '@/stores/admin';

const CKEditorField = dynamic(() => import('@/components/CKEditorField'), { ssr: false });
const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

const MAX_FILE_SIZE_MB = 3;

const NewsSchema = Yup.object().shape({
  title: Yup.string()
    .min(6, 'Tiêu đề có ít nhất 6 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự')
    .required('Tiêu đề là bắt buộc'),
  type: Yup.string().required('Loại bài viết là bắt buộc'),
  image: Yup.mixed<File>()
    .required('Ảnh là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 3MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  description: Yup.string().required('Mô tả là bắt buộc'),
  content: Yup.string().required('Nội dung bài viết là bắt buộc')
});

interface FormData {
  title: string;
  type: string;
  image: File | null;
  description: string;
  content: string;
}

function FormNews(props: { news: any }) {
  const { news } = props;
  const dispatch = useAppDispatch();
  // const newsData = _.find(listNewsFull, { news_id: Number(id) });
  // console.log('newsData: ', newsData);

  const initialNewsValues = {
    title: news?.news_title ?? '',
    type: String(news?.type) ?? '1',
    image: news?.news_images || (null as File | null),
    description: news?.news_descriptions ?? '',
    content: news?.news_content ?? ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      newsTitle: values.title,
      newsAscii: values.title,
      newsType: values.type,
      newsImages: values.image,
      newsDescriptions: values.description,
      newsContent: values.content
    };

    const result: any = await dispatch(addNewsAction(payload)).unwrap();

    if (result?.status === 200) {
      toast.success('Thêm tin thành công!');
    }
    formikHelpers.setSubmitting(false);
  };

  return (
    <Formik initialValues={initialNewsValues} validationSchema={NewsSchema} onSubmit={handleSubmit}>
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
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
          <div className="my-2 block">
            <span className=" text-xl font-bold text-yellow">Loại bài viết</span>
          </div>
          <div className="relative flex flex-row">
            <Field as="select" className="p-2 text-base font-bold" name="type" id="type">
              <option className="p-2 text-base font-bold" value="1">
                Tin tức
              </option>
              <option className="p-2 text-base font-bold" value="2">
                Thông Báo
              </option>
              <option className="p-2 text-base font-bold" value="3">
                Sự Kiện
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
            <span className="text-xl font-bold text-yellow">Ảnh title</span>
          </div>

          <ImageUpload name="image" />

          <ErrorMessage name="image" component="div" className="text-xl text-red-500" />
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
          <ErrorMessage name="description" component="div" className="text-xl text-red-500" />
        </motion.div>

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full"
        >
          <div className="my-2 block">
            <span className="text-xl font-bold text-yellow">Nội dung chi tiết</span>
          </div>
          <CKEditorField name="content" label="Nội dung chi tiết" />

          <ErrorMessage name="content" component="div" className="text-xl text-red-500" />
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
            <span className="text-base font-bold">Đăng tin</span>
          </button>
          <div className="border-b-2 border-dashed border-blue-500 pt-4" />
        </motion.div>
      </Form>
    </Formik>
  );
}

export default FormNews;

import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch } from '@/stores';
import { addEventRewardsAction } from '@/stores/admin';

const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

const MAX_FILE_SIZE_MB = 3;

const NewsSchema = Yup.object().shape({
  eventName: Yup.string()
    .min(1, 'Tên sự kiện ít nhất có 1 ký tự')
    .max(100, 'Tên sự kiện không được vượt quá 100 ký tự')
    .required('Tên sự kiện là bắt buộc'),
  typeEvent: Yup.string().required('Loại sự kiện là bắt buộc'),
  backgroundImage: Yup.mixed<File>()
    .required('Ảnh là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 3MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  startTime: Yup.date().required('Vui lòng set ngày bắt đầu sự kiện'),
  endTime: Yup.date()
    .required('Vui lòng set ngày kết thúc sự kiện')
    .min(new Date(), 'Không được chọn ngày trong quá khứ')
});

interface FormData {
  eventName: string;
  startTime: string;
  endTime: string;
  backgroundImage: File | null;
  typeEvent: 0;
}

export default function CreateEventRewards() {
  const dispatch = useAppDispatch();

  const initialNewsValues = {
    eventName: '',
    startTime: '',
    endTime: '',
    backgroundImage: null as File | null,
    typeEvent: 0
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const unixStartTime = moment(values.startTime).utcOffset('+0700');
    const unixEndTime = moment(values.endTime).utcOffset('+0700');

    const payload = {
      eventName: values.eventName,
      startTime: unixStartTime.valueOf(),
      endTime: unixEndTime.valueOf(),
      backgroundImage: values.backgroundImage,
      typeEvent: values.typeEvent
    };

    const result: any = await dispatch(addEventRewardsAction(payload)).unwrap();

    if (result?.status === 200) {
      formikHelpers.resetForm();
      toast.success('Thêm cấu hình thành công!');
      formikHelpers.setSubmitting(false);
    }
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
          <span className="text-5xl font-bold text-yellow">Thêm Event nạp - tiêu mới</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Vui lòng nhập thông tin cho sự kiện mới
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
                    <span className="text-xl font-bold text-yellow">Tên sự kiện</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="eventName"
                    name="eventName"
                    placeholder="Nhập tên sự kiện"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="eventName" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="my-2 block">
                    <span className=" text-xl font-bold text-yellow">Phân loại sự kiện</span>
                  </div>
                  <div className="relative flex flex-row">
                    <Field
                      as="select"
                      className="p-2 text-base font-bold"
                      name="typeEvent"
                      id="typeEvent"
                    >
                      <option className="p-2 text-base font-bold" value="0">
                        Nạp xu
                      </option>
                      <option className="p-2 text-base font-bold" value="1">
                        Tiêu xu
                      </option>
                    </Field>
                  </div>
                  <ErrorMessage name="typeEvent" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ngày bắt đầu sự kiện *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    placeholder="Chọn ngày bắt đầu sự kiện"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="startTime" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ngày kết thúc sự kiện *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    placeholder="Chọn ngày kết thúc sự kiện"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="endTime" component="div" className="text-xl text-red-500" />
                </motion.div>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ảnh nền của sự kiện</span>
                  </div>
                  <ImageUpload name="backgroundImage" />
                  <ErrorMessage
                    name="backgroundImage"
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
                    type="submit"
                  >
                    <span className="text-base font-bold">Thực hiện</span>
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

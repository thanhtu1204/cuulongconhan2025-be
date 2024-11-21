import type { FieldProps, FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addItemEventRewardsAction, getAllEventRewardsAction } from '@/stores/admin';
import { amountToWord } from '@/utils/utils';

const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

const MAX_FILE_SIZE_MB = 1;

const ItemSchema = Yup.object().shape({
  eventId: Yup.string().required('Loại sự kiện là bắt buộc'),
  rewardName: Yup.string()
    .min(1, 'Tên vật phẩm thưởng ít nhất có 1 ký tự')
    .max(100, 'Tên vật phẩm thưởng không được vượt quá 100 ký tự')
    .required('Tên vật phẩm thưởng là bắt buộc'),
  rewardPoint: Yup.string().required('mốc nhận vật phẩm thưởng là bắt buộc'),
  rewardItemCode: Yup.string().required('Item code vật phẩm thưởng là bắt buộc'),
  rewardImage: Yup.mixed<File>()
    .required('Ảnh vật phẩm là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 1MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  rewardDescription: Yup.string().required('Nhập thông tin của vật phẩm')
});

interface FormData {
  eventId: string;
  rewardName: string;
  rewardPoint: string;
  rewardItemCode: string;
  rewardDescription: string;
  rewardImage: File | null;
}

export default function CreateItemEventRewards() {
  const dispatch = useAppDispatch();
  const listEventRewards = useAppSelector((state) => state.admin.listEventRewards);

  const initialItemValues = {
    eventId: !_.isEmpty(listEventRewards) ? listEventRewards[0]?.event_id : '',
    rewardName: '',
    rewardPoint: '',
    rewardItemCode: '',
    rewardDescription: '',
    rewardImage: null as File | null
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      eventId: values.eventId,
      rewardName: values.rewardName,
      rewardPoint: values.rewardPoint,
      rewardItemCode: values.rewardItemCode,
      rewardDescription: values.rewardDescription,
      rewardImage: values.rewardImage
    };

    const result: any = await dispatch(addItemEventRewardsAction(payload)).unwrap();

    if (result?.status === 200) {
      formikHelpers.resetForm();
      toast.success('Thêm vật phẩm sự kiện thành công!');
      formikHelpers.setSubmitting(false);
    }
  };

  const getData = useCallback(async () => {
    return dispatch(getAllEventRewardsAction());
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
          <span className="text-5xl font-bold text-yellow">Thêm vật phẩm mốc nạp - tiêu mới</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Vui lòng nhập thông tin cho mốc nạp - tiêu mới
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
              initialValues={initialItemValues}
              validationSchema={ItemSchema}
              onSubmit={handleSubmit}
            >
              <Form className=" flex w-full flex-col bg-white p-4">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="my-2 block">
                    <span className=" text-xl font-bold text-yellow">Loại sự kiện</span>
                  </div>
                  <div className="relative flex flex-row">
                    <Field
                      as="select"
                      className="p-2 text-base font-bold"
                      name="eventId"
                      id="eventId"
                      defaultValue={
                        listEventRewards.length > 0 ? listEventRewards[0]?.event_id : ''
                      }
                    >
                      {listEventRewards.map((item) => (
                        <option
                          key={item?.event_id}
                          className="p-2 text-base font-bold"
                          value={item?.event_id}
                        >
                          {item.event_name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage name="eventId" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Tên vật phẩm</span>
                  </div>

                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="rewardName"
                    name="rewardName"
                    placeholder="Nhập tên vật phẩm"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="rewardName"
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
                    <span className="text-xl font-bold text-yellow">Mốc nhận vật phẩm</span>
                  </div>

                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="rewardPoint"
                    name="rewardPoint"
                    placeholder="Nhập mốc nhận vật phẩm"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="rewardPoint"
                    component="div"
                    className="text-xl text-red-500"
                  />
                </motion.div>
                <Field
                  name="rewardPoint"
                  render={({ field }: FieldProps<FormData['rewardPoint']>) => (
                    <div>{amountToWord(String(field.value))}</div>
                  )}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Item code vật phẩm</span>
                  </div>

                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="rewardItemCode"
                    name="rewardItemCode"
                    placeholder="Nhập Item code vật phẩm"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="rewardItemCode"
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
                    <span className="text-xl font-bold text-yellow">Mô tả vật phẩm</span>
                  </div>

                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="rewardDescription"
                    name="rewardDescription"
                    placeholder="Nhập mô tả vật phẩm ... vd: Nhận ngay 50 Huyết tinh"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="rewardDescription"
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
                    <span className="text-xl font-bold text-yellow">Ảnh của vật pẩm</span>
                  </div>
                  <ImageUpload name="rewardImage" />
                  <ErrorMessage
                    name="rewardImage"
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

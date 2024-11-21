import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { createGiftCodeAction } from '@/stores/admin';

const GiftSchema = Yup.object().shape({
  itemCode: Yup.string().required('Code vật phẩm là bắt buộc'),
  count: Yup.number()
    .required('Code vật phẩm là bắt buộc')
    .max(100, 'Số lượng không được vượt quá 100 để dễ quản lý'),
  expriedDate: Yup.date()
    .required('Vui lòng set ngày hết hạn của gift')
    .min(new Date(), 'Không được chọn ngày trong quá khứ')
});

interface FormData {
  itemCode: string;
  count: number;
  expriedDate: Date | null;
}

function CreateGift() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);

  const initialGiftValues = {
    itemCode: '',
    count: 0,
    expriedDate: null
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      itemCode: values.itemCode,
      count: values.count,
      expriedDate: values.expriedDate
    };

    const result: any = await dispatch(createGiftCodeAction(payload)).unwrap();

    if (result?.status === 200) {
      toast.success('Thêm giftcode thành công!');
      formikHelpers.resetForm();
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
          <span className="text-5xl font-bold text-yellow">Tạo giftcode mới</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Có thể tạo một hoặc tạo hàng loạt gifcode
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
              initialValues={initialGiftValues}
              validationSchema={GiftSchema}
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
                    <span className="text-xl font-bold text-yellow">ID Vật phẩm *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="itemCode"
                    name="itemCode"
                    placeholder="Nhập ID vật phẩm"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="itemCode" component="div" className="text-xl text-red-500" />
                </motion.div>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ngày hết hạn *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="datetime-local"
                    id="expriedDate"
                    name="expriedDate"
                    placeholder="Chọn ngày và giờ hết hạn của gifcode"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="expriedDate"
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
                    <span className=" text-xl font-bold text-yellow">
                      Số lượng Gifcode muốn tạo
                    </span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="count"
                    name="count"
                    placeholder="Nhập số lượng"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="count" component="div" className="text-xl text-red-500" />
                </motion.div>
                <div className="my-2 mt-14 block">
                  <span className=" text-xl font-bold text-yellow">
                    Sau khi tạo xong có thể quay lại phần quản lý để xuất danh sách gift hoặc kiểm
                    tra trạng thái giftcode
                  </span>
                </div>
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
                    <span className="text-base font-bold">Tạo Gifcode</span>
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

export default CreateGift;

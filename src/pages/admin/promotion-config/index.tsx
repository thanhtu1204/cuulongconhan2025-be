import type { FieldProps, FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addConfigPromotionAction, getAllPromotionAction } from '@/stores/admin';
import { amountToWord, numberWithDot } from '@/utils/utils';

const ConfigSchema = Yup.object().shape({
  minAmount: Yup.number().required('Trường bắt buộc'),
  maxAmount: Yup.number().required('Trường bắt buộc'),
  discountPercentage: Yup.number().required('Trường bắt buộc'),
  startDate: Yup.date().required('Vui lòng set ngày bắt đầu KM'),
  endDate: Yup.date()
    .required('Vui lòng set ngày hết hạn KM')
    .min(new Date(), 'Không được chọn ngày trong quá khứ')
});

interface FormData {
  minAmount: number;
  maxAmount: number;
  discountPercentage: number;
  startDate: Date | null;
  endDate: Date | null;
}

export default function ConfigPromotion() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);
  const listPromotion = useAppSelector((state) => state.admin.listPromotion);

  const initialConfigValues = {
    minAmount: 0,
    maxAmount: 0,
    discountPercentage: 0,
    startDate: null,
    endDate: null
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      ...values,
      startDate: values?.startDate ? moment(values.startDate).valueOf() : null,
      endDate: values?.endDate ? moment(values.endDate).valueOf() : null
    };
    const result: any = await dispatch(addConfigPromotionAction(payload)).unwrap();

    if (result?.status === 200) {
      toast.success('Cấu hình thành công!');
      formikHelpers.resetForm();
      getData().then(() => {});
    }
    formikHelpers.setSubmitting(false);
  };

  const getData = useCallback(async () => {
    return dispatch(getAllPromotionAction());
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
          <span className="text-5xl font-bold text-yellow">
            Cấu hình khuyến mãi nạp tiền cho auto nạp tiền user!
          </span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y px-8 py-4 text-center text-2xl text-black">
            Lưu ý : 1: Set tỉ lệ từ 0 -{'>'} 100% ví dụ : 100% nạp 10k được 20k <br /> 2: set ngày
            giờ hệu lực của sự kiện khuyến mãi! <br /> 3: có thể kích hoạt hoặc huỷ tuỳ ý! <br />
            4: chỉ bật được một sự kiện khuyến mãi một lúc <br />
            5: có thể đặt giới hạn số tiền để được khuyễn mãi ví dụ {'>'}= 100k hoặc lớn hơn 200K
            thì sẽ được km 20%
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
                    <span className="text-xl font-bold text-yellow">
                      Số tiền tối thiểu để được khuyến mãi
                    </span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    placeholder="Nhập số tiền tối thiểu"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="minAmount" component="div" className="text-xl text-red-500" />
                  <Field
                    name="minAmount"
                    render={({ field }: FieldProps<FormData['minAmount']>) => (
                      <div>{amountToWord(String(field.value))}</div>
                    )}
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
                      Số tiền tối đa để được khuyến mãi
                    </span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    placeholder="Nhập số tiền đa"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="maxAmount" component="div" className="text-xl text-red-500" />

                  <Field
                    name="maxAmount"
                    render={({ field }: FieldProps<FormData['maxAmount']>) => (
                      <div>{amountToWord(String(field.value))}</div>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ngày hiệu lực *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="datetime-local" // Đổi thành datetime-local
                    id="startDate"
                    name="startDate"
                    placeholder="Chọn ngày và giờ hiệu lực của khuyến mãi"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="startDate" component="div" className="text-xl text-red-500" />
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
                    type="datetime-local" // Đổi thành datetime-local
                    id="endDate"
                    name="endDate"
                    placeholder="Chọn ngày và giờ hết hạn của khuyến mãi"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="endDate" component="div" className="text-xl text-red-500" />
                </motion.div>

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Tỉ lệ khuyến mãi %</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    placeholder="Nhập số % muốn khuyễn mãi tỉ lệ %"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="discountPercentage"
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
                  {/* <button */}
                  {/*  onPaste={() => {}} */}
                  {/*  className="bg-red-400 rounded border border-blue-700  px-4 py-2 font-bold text-white mr-[20%]" */}
                  {/*  disabled={loading} */}
                  {/*  type="button" */}
                  {/* > */}
                  {/*  <span className="text-base font-bold">Tắt</span> */}
                  {/* </button> */}

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
        <div className="flex w-full flex-col items-center justify-center">
          <span className="text-xl text-yellow">Cấu hình hiện tại</span>
          {!_.isEmpty(listPromotion) && (
            <div className="border-2 border-solid border-indigo-600 p-2">
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                ID: {listPromotion?.id}
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Thời gian bắt đầu:{' '}
                {moment(Number(listPromotion?.start_date)).isValid()
                  ? moment(Number(listPromotion?.start_date)).format('DD/MM/YYYY HH:mm:ss')
                  : 'Không xác định'}
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Thời gian kết thúc:{' '}
                {moment(Number(listPromotion?.end_date)).isValid()
                  ? moment(Number(listPromotion?.end_date)).format('DD/MM/YYYY HH:mm:ss')
                  : 'Không xác định'}
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Tỉ lệ khuyến mãi: {listPromotion?.discount_percentage}%
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Is Active: {listPromotion?.is_active.toString()}
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Min Amount: {numberWithDot(listPromotion?.min_amount || 0)} VND
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Max Amount: {numberWithDot(listPromotion?.max_amount || 0)} VND
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Created At: {listPromotion?.create_at}
              </span>
              <br />
              <span className="flex w-full border-2 border-solid border-emerald-400 p-2">
                Updated At: {listPromotion?.update_at}
              </span>
              <br />
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}

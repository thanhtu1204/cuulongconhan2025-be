import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AdminLayout from '@/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addItemAction } from '@/stores/admin';

const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });

const MAX_FILE_SIZE_MB = 1;

const NewsSchema = Yup.object().shape({
  itemCategory: Yup.string().required('Phân loại vật phẩm là bắt buộc'),
  itemCode: Yup.string().required('ID Code vật phẩm là bắt buộc'),
  name: Yup.string().required('Tên vật phẩm là bắt buộc'),
  image: Yup.mixed<File>()
    .required('Ảnh là bắt buộc')
    .test(
      'fileSize',
      'Kích thước file phải nhỏ hơn 1MB',
      (value: any) => !value || (value.size && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
    ),
  description: Yup.string().required('Mô tả là bắt buộc'),
  price: Yup.string().required('giá vật phẩm là bắt buộc')
});

interface FormData {
  itemCategory: string;
  itemCode: string;
  name: string;
  image: File | null;
  description: string;
  price: string;
  // @item_category as int,
  // @item_code as int,
  // @item_price as int,
  // @item_day as int,
  // @item_quantity as int,
  // @item_status as int,
  // @item_name as nvarchar(400),
  // @item_description as  nvarchar(400),
  // @item_image as  nvarchar(400),
  // @key_word as   nvarchar(20),
  // @is_present as int
}

function AddItem() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.authen);

  const initialNewsValues = {
    itemCategory: '0',
    itemCode: '',
    name: '',
    image: null as File | null,
    description: '',
    price: ''
  };

  const handleSubmit = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
    const payload = {
      itemCategory: values.itemCategory,
      itemCode: values.itemCode,
      name: values.name,
      image: values.image,
      descriptions: values.description,
      price: values.price
    };

    const result: any = await dispatch(addItemAction(payload)).unwrap();

    if (result?.status === 200) {
      toast.success('Thêm Vật phẩm thành công!');
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
          <span className="text-5xl font-bold text-yellow">Thêm Vật phẩm KTC mới</span>
        </div>
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center divide-y py-4 text-center text-2xl text-black">
            Vui lòng nhập thông tin cho Vật phẩm KTC mới
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
                  transition={{ duration: 0.8 }}
                >
                  <div className="my-2 block">
                    <span className=" text-xl font-bold text-yellow">Phân loại vật phẩm</span>
                  </div>
                  <div className="relative flex flex-row">
                    <Field
                      as="select"
                      className="p-2 text-base font-bold"
                      name="itemCategory"
                      id="itemCategory"
                    >
                      <option className="p-2 text-base font-bold" value="0">
                        Gói vật phẩm
                      </option>
                      <option className="p-2 text-base font-bold" value="1">
                        Kinh nghiệm/Hoả hầu
                      </option>
                      <option className="p-2 text-base font-bold" value="2">
                        Nâng cấp
                      </option>
                      <option className="p-2 text-base font-bold" value="3">
                        Hiệu quả
                      </option>
                      <option className="p-2 text-base font-bold" value="4">
                        Khác
                      </option>
                      <option className="p-2 text-base font-bold" value="5">
                        Vật phẩm thưởng
                      </option>
                      <option className="p-2 text-base font-bold" value="6">
                        Thời trang
                      </option>
                    </Field>
                  </div>
                  <ErrorMessage
                    name="itemCategory"
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
                    <span className="text-xl font-bold text-yellow">Item code Vật phẩm *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="itemCode"
                    name="itemCode"
                    placeholder="Nhập item code của vật phẩm"
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="itemCode" component="div" className="text-xl text-red-500" />
                </motion.div>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="my-2 block">
                    <span className=" text-xl font-bold text-yellow">Tên vật phẩm *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nhập tên vật phẩm ..."
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="name" component="div" className="text-xl text-red-500" />
                </motion.div>
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full"
                >
                  <div className="my-2 block">
                    <span className="text-xl font-bold text-yellow">Ảnh Vật phẩm *</span>
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
                    <span className="text-xl font-bold text-yellow">Mô tả vật phẩm *</span>
                  </div>
                  <Field
                    className="h-24 w-full rounded text-xl"
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Nhập mô tả vật phẩm..."
                    required
                    autoComplete="off"
                    maxLength="255"
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
                    <span className="text-xl font-bold text-yellow">Giá vật phẩm *</span>
                  </div>
                  <Field
                    className="h-14 w-full rounded text-xl"
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Nhập giá vật phẩm..."
                    required
                    autoComplete="off"
                  />
                  <ErrorMessage name="price" component="div" className="text-xl text-red-500" />
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
                    <span className="text-base font-bold">Đăng vật phẩm</span>
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

export default AddItem;

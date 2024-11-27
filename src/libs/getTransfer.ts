import axios from 'axios';
import _, { forEach } from 'lodash';

import { Env } from '@/libs/Env.mjs';
import type { ITransactionMbbank } from '@/types/transaction';
import { findIdWithTransaction } from '@/utils/utils';

const axiosInstance = axios.create({
  baseURL: 'https://api.web2m.com/historyapimbv3/',
  headers: {
    'Content-Type': 'application/json'
  }
});

const url = `https://api.web2m.com/historyapimbv3/${Env.BANK_PASSWORD}/${Env.BANK_NUMBER}/${Env.BANK_TOKEN}`;

export const getDataMbank = async () => {
  try {
    const response = await axiosInstance.get(url);
    if (response && response?.status === 200 && response?.data?.status && response.data) {
      const listTrans: ITransactionMbbank[] = response.data.transactions;
      const listTransactionConvert: ITransactionMbbank[] = [];
      forEach(_.filter(listTrans, { type: 'IN' }), (data) => {
        const strId = findIdWithTransaction(data?.description || '');
        if (strId) {
          const item = { ...data, description: strId };
          return listTransactionConvert.push(item);
        }
        return data;
      });
      return listTransactionConvert;
    }
    return null;
  } catch (err) {
    return err;
  }
};

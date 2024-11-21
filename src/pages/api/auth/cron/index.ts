import _, { filter } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import DatabaseDragonsAccount from '@/libs/dbNineDragonsAccount';
import { getDataMbank } from '@/libs/getTransfer';
import { connectAndExecute, getFirstPromotionConfig } from '@/libs/NineDragonsAccount';
import type { ITransactionMbbank } from '@/types/transaction';
import type BaseResponse from '@/utils/BaseResponse';
import { rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ statu: 405, error: 'Method Not Allowed' });
  }

  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const verifiedToken = token === 'ABCXCCXAAAA@123@22123CLCNCHECK';

  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }
  if (!verifiedToken) {
    return res.status(401).json({ status: 401, message: 'Phiên không hợp lệ', data: null });
  }

  try {
    const dataTransfer: ITransactionMbbank[] = await getDataMbank();
    const userList = await DatabaseDragonsAccount.getAllUser();
    const transactionListDb = await DatabaseDragonsAccount.getTransactionBank();
    const logArr: any[] = [];
    const mergedArray: ITransactionMbbank[] = filter(
      dataTransfer,
      (item) => !transactionListDb.some((some) => item.transactionID === some.transaction_bank_id)
    );
    logArr.push({ 'list_new_add:': mergedArray?.length });
    if (!_.isEmpty(mergedArray)) {
      let promotion: any;
      await connectAndExecute(async (pool) => {
        promotion = await getFirstPromotionConfig(pool);
      });
      if (promotion) {
        const resulTransaction = await DatabaseDragonsAccount.addMultipleTransactionBank(
          mergedArray,
          promotion
        );
        logArr.push(...resulTransaction);

        const result = await DatabaseDragonsAccount.addMultipleBalances(
          userList,
          mergedArray,
          promotion
        );
        logArr.push(...result.logArr);
      } else {
        const resulTransaction =
          await DatabaseDragonsAccount.addMultipleTransactionBank(mergedArray);
        logArr.push(...resulTransaction);

        const result = await DatabaseDragonsAccount.addMultipleBalances(userList, mergedArray);
        logArr.push(...result.logArr);
      }
    }

    const response: BaseResponse = {
      status: 200,
      success: true,
      message: 'Cron successfully',
      data: logArr
    };
    return res.status(200).json(response);
  } catch (error) {
    const response: BaseResponse = {
      status: 500,
      success: false,
      message: 'An internal server error occurred'
    };
    return res.status(500).json(response);
  }
}

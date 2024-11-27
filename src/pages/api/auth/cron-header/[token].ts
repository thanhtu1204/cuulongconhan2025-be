import _, { filter } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { sendTelegramNotification } from '@/libs/customNoti';
import DatabaseDragonsAccount from '@/libs/dbNineDragonsAccount';
import { getDataMbank } from '@/libs/getTransfer';
import { syncAndUpdateBalance } from '@/libs/mongo/controller/BonusUserController';
import type { ITransactionMbbank } from '@/types/transaction';
import type BaseResponse from '@/utils/BaseResponse';
import { numberWithDot, rateLimiterMiddleware } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ statu: 405, error: 'Method Not Allowed' });
  }

  const clientIp = req.socket.remoteAddress;
  const isAllowed = rateLimiterMiddleware(clientIp ?? '') || false;
  const { token } = req.query;

  const verifiedToken = token === 'ABCXCCXAAAA@123@22123CLCNCHECK2025';

  if (!verifiedToken) {
    return res.status(401).json({ status: 401, message: 'Phiên không hợp lệ', data: null });
  }

  if (!isAllowed) {
    return res
      .status(429)
      .json({ status: 429, message: 'Yêu cầu quá nhanh, vui lòng thử lại sau.' });
  }

  try {
    const dataTransfer: ITransactionMbbank[] = await getDataMbank();
    const userList = await DatabaseDragonsAccount.getAllUser();
    const transactionListDb = await DatabaseDragonsAccount.getTransactionBank();
    const logArr: any[] = [];
    const mergedArray: ITransactionMbbank[] = filter(
      dataTransfer,
      (item) =>
        !transactionListDb.some(
          (some: any) => String(item.transactionID) === String(some.transaction_bank_id)
        )
    );
    logArr.push({ 'list_new_add:': mergedArray?.length });
    if (!_.isEmpty(mergedArray)) {
      const promotion = await DatabaseDragonsAccount.getFirstPromotionConfig();
      if (promotion) {
        const resulTransaction = await DatabaseDragonsAccount.addMultipleTransactionBank(
          mergedArray,
          promotion
        );
        logArr.push(...resulTransaction);
        const result = await DatabaseDragonsAccount.addMultipleBalances(userList, mergedArray);
        logArr.push(...result.logArr);
        // for (const record of mergedArray) {
        //   const code = Number(record.description);
        //   const user = userList.find((some: any) => code === some.user_id);
        //   if (user) {
        //     const originalAmount = Number(record.amount);
        //     const minAmount = Number(promotion?.min_amount || 0);
        //     const maxAmount = Number(promotion?.max_amount || 0);
        //     const discountPercentage = Number(promotion?.discount_percentage || 0);
        //
        //     if (originalAmount >= minAmount && originalAmount <= maxAmount) {
        //       const amountCalculated = originalAmount * (discountPercentage / 100);
        //       const resultUpdateBonus = await syncAndUpdateBalance(user, amountCalculated);
        //       logArr.push(resultUpdateBonus);
        //     }
        //   }
        // }
        const promises = mergedArray.map(async (record) => {
          const code = Number(record.description);
          const user = userList.find((some: any) => code === some.user_id);
          if (user) {
            const originalAmount = Number(record.amount);
            const minAmount = Number(promotion?.min_amount || 0);
            const maxAmount = Number(promotion?.max_amount || 0);
            const discountPercentage = Number(promotion?.discount_percentage || 0);

            if (originalAmount >= minAmount && originalAmount <= maxAmount) {
              const amountCalculated = originalAmount * (discountPercentage / 100);
              const resultUpdateBonus = await syncAndUpdateBalance(user, amountCalculated);

              // Thêm vào logArr ngay sau khi xử lý xong.
              logArr.push(resultUpdateBonus);
              return resultUpdateBonus; // Trả về kết quả để collect lại sau.
            }
          }
          return null; // Trả về null nếu không tìm thấy user hoặc không thỏa điều kiện.
        });
        await Promise.all(promises);
      } else {
        const resulTransaction =
          await DatabaseDragonsAccount.addMultipleTransactionBank(mergedArray);
        logArr.push(...resulTransaction);

        const result = await DatabaseDragonsAccount.addMultipleBalances(userList, mergedArray);
        logArr.push(...result.logArr);
      }

      const message = `🎁 Có thông tin nạp mới cron-header 🎁
 ${mergedArray
   .map(
     (item) => `
-Mã giao dịch: ${item?.transactionID}
-Số tiền: ${numberWithDot(Number(item?.amount) ?? 0)} VND
-Nội dung: ${item?.description}
-transactionDate: ${item?.transactionDate}
-type: ${item?.type}`
   )
   .join('')}`;
      await sendTelegramNotification(message);
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

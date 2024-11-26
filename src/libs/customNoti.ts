import axios from 'axios';

import { Env } from '@/libs/Env.mjs';

const botToken = Env.TELEGRAM_BOT_TOKEN;
const channelId = Env.TELEGRAM_CHANNEL_ID;
const telegramApiUrl = `https://api.telegram.org/bot${botToken}`;

export async function sendTelegramNotification(message: string): Promise<void> {
  const sendMessageUrl = `${telegramApiUrl}/sendMessage`;
  try {
    await axios.post(sendMessageUrl, {
      chat_id: channelId,
      text: message,
      parse_mode: 'HTML'
    });
    // const sendResponse = await axios.post(sendMessageUrl, {
    //     chat_id: channelId,
    //     text: message,
    //     parse_mode: "HTML"
    // });

    // if (sendResponse.data.ok) {
    //     console.log("Notification sent successfully", sendResponse.data);
    // } else {
    //     console.error("Failed to send notification", sendResponse.data);
    // }
  } catch (error) {
    // console.error("Error sending notification:", error);
  }
}

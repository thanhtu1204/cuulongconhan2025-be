/* eslint-disable import/prefer-default-export */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
  server: {
    DATABASE_URL: z.string().nonempty(),
    DATABASE_USERNAME: z.string().nonempty(),
    DATABASE_PASSWORD: z.string().nonempty(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    NEXTAUTH_SECRET: z.string().nonempty(),
    VIETQR_CLIENT_ID: z.string().nonempty(),
    VIETQR_API_KEY: z.string().nonempty(),
    BANK_NUMBER: z.string().nonempty(),
    BANK_PASSWORD: z.string().nonempty(),
    BANK_TOKEN: z.string().nonempty(),
    CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
    CLOUDINARY_API_KEY: z.string().nonempty(),
    CLOUDINARY_API_SECRET: z.string().nonempty(),
    ADMIN_PASSWORD: z.string().nonempty(),
    S3_ENDPOINT_URL: z.string().nonempty(),
    S3_ACCESS_KEY: z.string().nonempty(),
    S3_SECRET_KEY: z.string().nonempty(),
    RECAPTCHA_SECRET_KEY: z.string().nonempty(),
    TELEGRAM_BOT_TOKEN: z.string().nonempty(),
    TELEGRAM_CHANNEL_ID: z.string().nonempty()
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    VIETQR_CLIENT_ID: process.env.VIETQR_CLIENT_ID,
    VIETQR_API_KEY: process.env.VIETQR_API_KEY,
    BANK_NUMBER: process.env.BANK_NUMBER,
    BANK_PASSWORD: process.env.BANK_PASSWORD,
    BANK_TOKEN: process.env.BANK_TOKEN,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID
  }
});

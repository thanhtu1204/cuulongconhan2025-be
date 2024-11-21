import { jwtVerify } from 'jose';

import { Env } from '@/libs/Env.mjs';

interface UserJwtPayload {
  id: number;
  user_name: string;
  displayName: string;
  balance: number;
  isActivate: boolean;
  roles: string;
  jti: string;
  iat: number;
}

export const getJwtSecretKey = () => {
  const secret = Env.NEXTAUTH_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.');
  }
  return secret;
};
export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
    return verified.payload as unknown as UserJwtPayload;
  } catch (error) {
    throw new Error('Your token has expired.');
  }
};

export const verifyAuthAdmin = async (token: string): Promise<boolean> => {
  try {
    const userPayload = await verifyAuth(token);
    return userPayload.roles === 'ADMIN';
  } catch (error) {
    return false;
  }
};

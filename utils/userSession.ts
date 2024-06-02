'use server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { SESSION_TIMEOUT } from '@/app/globals';

const key = new TextEncoder().encode(process.env.SESSION_ENCRYPTION_KEY);

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Date.now() + SESSION_TIMEOUT)
    .sign(key);
}

async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export const setUserSession = async (user: any) => {
  const expires = new Date(Date.now() + SESSION_TIMEOUT);
  const session = await encrypt({ user, expires });
  cookies().set('session', session, { expires, httpOnly: true });
};

export const getUserFromSession = async () => {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
};

export const clearSession = async () => {
  cookies().delete('session');
};

import { Request, Response, NextFunction } from 'express';
const { SECRET_KEY } = process.env;
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const iv = randomBytes(16);
const password = SECRET_KEY;
export async function appMiddlere(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = await encryptText('angelben');
  console.log(token,'token');
  const Authorization = req.header('app_token');
  if (Authorization) {
    const secretKey = SECRET_KEY;
    const isTokenMatch = await bcrypt.compare(secretKey, Authorization);
    if (!isTokenMatch) next(new UnauthorizedException('Invalid App token'));
    // console.log(Authorization)

    next();
  } else {
    next(new UnauthorizedException('Invalid App token'));
  }
}

export const encryptText = async (secret: string) => {
  const password = 'Password used to generate key';

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(secret),
    cipher.final(),
  ]);
  return encryptedText;
};
export const decryptText = async (token: any) => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(token),
    decipher.final(),
  ]);
  return decryptedText;
};

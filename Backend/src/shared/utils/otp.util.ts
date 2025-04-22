import * as crypto from 'crypto';

export const generateOtpCode = (length: number): string => {
  const digits = '0123456789';

  let otpCode = '';

  for (let i = 0; i < length; i++) {
    otpCode += digits[Math.floor(Math.random() * 10)];
  }

  return otpCode;
};

export const generateOtpCodeHash = (otpCode: string): string => {
  const otpCodeHash = crypto.createHash('sha256').update(otpCode).digest('hex');

  return otpCodeHash;
};

export const generateOtpDetails = (
  length: number = 6,
  expiryTimeInMins: number = 10,
): {
  otpCode: string;
  otpCodeHash: string;
  otpCodeExpiry: Date;
} => {
  const otpCode = generateOtpCode(length);
  const otpCodeHash = generateOtpCodeHash(otpCode);

  const date = new Date();
  date.setTime(date.getTime() + expiryTimeInMins * 60 * 1000);

  return {
    otpCode,
    otpCodeHash,
    otpCodeExpiry: date,
  };
};

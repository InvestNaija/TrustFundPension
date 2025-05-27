import * as crypto from 'crypto';

export const generateReferralCode = (length: number = 8): string => {
  // Generate a random string of specified length
  const randomBytes = crypto.randomBytes(length);
  const referralCode = randomBytes.toString('hex').toUpperCase().slice(0, length);
  
  return referralCode;
}; 
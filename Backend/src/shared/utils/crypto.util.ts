import * as crypto from 'crypto';

export const generateToken = (): { token: string; tokenHash: string } => {
  // Generate token
  const token = crypto.randomBytes(20).toString('hex');

  // Create the hash of the token
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  return { token, tokenHash };
};

export const generateTokenHash = (token: string): string => {
  // Create the hash of the token
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  return tokenHash;
};

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import { UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../core/config';

const ivLength = 12; // GCM uses a 12-byte IV for optimal security
const keyLength = 32; // AES-256 needs a 32-byte key
const saltLength = 16; // Standard length for salt

export const encryptString = (plainText: string): string => {
  try {
    if (!envConfig.ENCRYPTION_SECRET_KEY) {
      throw new UnprocessableEntityException('Encryption secret key is not configured');
    }
    // Generate a new random salt for each encryption
    const salt = randomBytes(saltLength);

    // Derive the encryption key using scrypt with the secret key and salt
    const key = scryptSync(envConfig.ENCRYPTION_SECRET_KEY, salt, keyLength);

    // Generate a random initialization vector (IV)
    const iv = randomBytes(ivLength);

    // Create the cipher instance with AES-256-GCM
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    // Encrypt the plaintext
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the authentication tag for GCM
    const authTag = cipher.getAuthTag().toString('hex');

    // Return the salt, IV, encrypted text, and authentication tag as a single string
    const cipherText = `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}:${authTag}`;

    return cipherText;
  } catch (error) {
    console.error(`Error encrypting string: ${error.message}`);

    throw new UnprocessableEntityException('Sorry, an error occurred.');
  }
};

export const decryptString = (cipherText: string): string => {
  try {
    if (!envConfig.ENCRYPTION_SECRET_KEY) {
      throw new UnprocessableEntityException('Encryption secret key is not configured');
    }
    // Split the cipherText into its components: salt, IV, encrypted text, and auth tag
    const [saltHex, ivHex, encrypted, authTagHex] = cipherText.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    // Derive the same encryption key using the secret and salt
    const key = scryptSync(envConfig.ENCRYPTION_SECRET_KEY, salt, keyLength);

    // Create the decipher instance with AES-256-GCM
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag); // Set the authentication tag

    // Decrypt the text
    let originalText = decipher.update(encrypted, 'hex', 'utf8');
    originalText += decipher.final('utf8');

    return originalText;
  } catch (error) {
    console.error(`Error decrypting string: ${error.message}`);

    throw new UnprocessableEntityException('Sorry, an error occurred.');
  }
};

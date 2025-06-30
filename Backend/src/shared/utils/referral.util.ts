import * as crypto from 'crypto';

/**
 * Generates a random referral code of specified length
 * @param length - The length of the referral code (default: 8)
 * @returns A random hexadecimal string in uppercase
 * 
 * @example
 * ```typescript
 * const code = generateReferralCode(); // e.g., "A1B2C3D4"
 * const code6 = generateReferralCode(6); // e.g., "F5E4D3"
 * ```
 */
export const generateReferralCode = (length: number = 8): string => {
  // Generate a random string of specified length
  const randomBytes = crypto.randomBytes(length);
  const referralCode = randomBytes.toString('hex').toUpperCase().slice(0, length);
  
  return referralCode;
};

/**
 * Generates a name-based referral code using user initials
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param length - Total length of the referral code (default: 6)
 * @returns A referral code starting with user initials followed by random characters
 * 
 * @example
 * ```typescript
 * const code = generateNameBasedReferralCode('John', 'Doe'); // e.g., "JD4F2A"
 * const code8 = generateNameBasedReferralCode('Mary', 'Jane', 8); // e.g., "MJ1B3C4D"
 * ```
 */
export const generateNameBasedReferralCode = (firstName: string, lastName: string, length: number = 8): string => {
  // Extract initials: first two letters of first name + first letter of last name
  const firstTwo = firstName.substring(0, 2).replace(/[^a-zA-Z]/g, '').toUpperCase();
  const lastInitial = lastName.charAt(0).replace(/[^a-zA-Z]/g, '').toUpperCase();
  const initials = firstTwo + lastInitial;
  
  // Generate random alphanumeric suffix
  const suffixLength = length - initials.length;
  const randomSuffix = crypto.randomBytes(suffixLength).toString('hex').toUpperCase().slice(0, suffixLength);
  
  return initials + randomSuffix;
};

/**
 * Generates a unique referral code with collision detection
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param checkExists - Async function to check if a code already exists
 * @param maxAttempts - Maximum attempts to generate a unique code (default: 10)
 * @returns A unique referral code
 * 
 * @example
 * ```typescript
 * // Using with database check
 * const code = await generateUniqueReferralCode(
 *   'John', 
 *   'Doe',
 *   async (code) => {
 *     const exists = await db.referrals.count({ where: { code } });
 *     return exists;
 *   }
 * );
 * 
 * // Using with your existing pattern
 * const code = await generateUniqueReferralCode(
 *   firstName,
 *   lastName,
 *   async (code) => {
 *     const refCodeExists = await pgINDB.models.customer.count({
 *       where: { refCode: code }
 *     });
 *     return refCodeExists;
 *   }
 * );
 * ```
 */
export const generateUniqueReferralCode = async (
  firstName: string, 
  lastName: string, 
  checkExists: (code: string) => Promise<number>,
  maxAttempts: number = 10
): Promise<string> => {
  let attempts = 0;
  let refCode: string;
  let refCodeExists: number;

  do {
    // Use name-based generation for better readability
    refCode = generateNameBasedReferralCode(firstName, lastName);
    refCodeExists = await checkExists(refCode);
    attempts++;
    
    // If we've tried too many times, fall back to random generation
    if (attempts > maxAttempts / 2) {
      refCode = generateReferralCode(8);
      refCodeExists = await checkExists(refCode);
    }
  } while (refCodeExists > 0 && attempts < maxAttempts);

  // If we still have conflicts after max attempts, add timestamp
  if (refCodeExists > 0) {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
    refCode = refCode.slice(0, -3) + timestamp;
  }

  return refCode;
}; 
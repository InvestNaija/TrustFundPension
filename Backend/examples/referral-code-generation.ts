/**
 * Example: Improved Referral Code Generation
 * 
 * This file demonstrates how to use the enhanced referral code generation utilities
 * that provide better readability and collision detection.
 */

import { generateReferralCode, generateNameBasedReferralCode, generateUniqueReferralCode } from '../src/shared/utils/referral.util';

// Example 1: Basic random referral code generation
console.log('=== Basic Random Referral Codes ===');
console.log('8-char code:', generateReferralCode()); // e.g., "A1B2C3D4"
console.log('6-char code:', generateReferralCode(6)); // e.g., "F5E4D3"
console.log('10-char code:', generateReferralCode(10)); // e.g., "A1B2C3D4E5"

// Example 2: Name-based referral code generation
console.log('\n=== Name-Based Referral Codes ===');
console.log('John Doe:', generateNameBasedReferralCode('John', 'Doe')); // e.g., "JD4F2A"
console.log('Mary Jane:', generateNameBasedReferralCode('Mary', 'Jane')); // e.g., "MJ1B3C"
console.log('O\'Connor Smith:', generateNameBasedReferralCode('O\'Connor', 'Smith')); // e.g., "OS4F2A"

// Example 3: Your existing pattern improved
async function generateUserReferralCode(firstName: string, lastName: string) {
  // Simulate your database check function
  const checkCodeExists = async (code: string): Promise<number> => {
    // This would be your actual database query
    // const refCodeExists = await pgINDB.models.customer.count({
    //   where: { refCode: code },
    // });
    
    // For demo purposes, simulate some existing codes
    const existingCodes = ['JD4F2A', 'MJ1B3C', 'OS4F2A'];
    return existingCodes.includes(code) ? 1 : 0;
  };

  try {
    const refCode = await generateUniqueReferralCode(
      firstName,
      lastName,
      checkCodeExists,
      10 // max attempts
    );
    
    console.log(`Generated unique code for ${firstName} ${lastName}: ${refCode}`);
    return refCode;
  } catch (error) {
    console.error('Failed to generate referral code:', error);
    throw error;
  }
}

// Example 4: Usage in your existing code pattern
async function createUserWithReferralCode(firstName: string, lastName: string) {
  console.log(`\n=== Creating user: ${firstName} ${lastName} ===`);
  
  // Your existing pattern improved
  const refCode = await generateUserReferralCode(firstName, lastName);
  
  // Continue with user creation...
  console.log(`User created with referral code: ${refCode}`);
  
  return {
    firstName,
    lastName,
    refCode,
    // ... other user data
  };
}

// Example 5: Batch generation with collision handling
async function generateMultipleCodes() {
  console.log('\n=== Batch Code Generation ===');
  
  const users = [
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Smith' },
    { firstName: 'Bob', lastName: 'Johnson' },
    { firstName: 'Alice', lastName: 'Brown' },
  ];

  for (const user of users) {
    await generateUserReferralCode(user.firstName, user.lastName);
  }
}

// Run examples
async function runExamples() {
  try {
    // Run basic examples
    console.log('=== Referral Code Generation Examples ===\n');
    
    // Examples 1 & 2 (synchronous)
    console.log('=== Basic Random Referral Codes ===');
    console.log('8-char code:', generateReferralCode());
    console.log('6-char code:', generateReferralCode(6));
    
    console.log('\n=== Name-Based Referral Codes ===');
    console.log('John Doe:', generateNameBasedReferralCode('John', 'Doe'));
    console.log('Mary Jane:', generateNameBasedReferralCode('Mary', 'Jane'));
    
    // Examples 3-5 (asynchronous)
    await generateUserReferralCode('John', 'Doe');
    await generateUserReferralCode('Jane', 'Smith');
    await generateMultipleCodes();
    
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in other files
export {
  generateUserReferralCode,
  createUserWithReferralCode,
  generateMultipleCodes
};

// Run if this file is executed directly
if (require.main === module) {
  runExamples();
} 
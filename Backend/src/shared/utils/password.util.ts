export const generatePassword = (length = 8) => {
  let result = '';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  const allChars = lowerCase + upperCase + numbers + specialChars;

  // Ensure the password contains at least one character from each category
  result += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
  result += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length),
  );

  // Fill the rest of the password length with random characters
  for (let i = result.length; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to ensure randomness
  result = result
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return result;
};

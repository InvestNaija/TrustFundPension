import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string | undefined> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error(`Error hashing password: ${error}`);
    return undefined;
  }
};

export const verifyPassword = async (
  enteredPassword: string,
  savedPassword: string,
): Promise<boolean | undefined> => {
  try {
    const isValidPassword = await bcrypt.compare(
      enteredPassword,
      savedPassword,
    );
    return isValidPassword;
  } catch (error) {
    console.error(`Error verifying password: ${error}`);
    return undefined;
  }
};

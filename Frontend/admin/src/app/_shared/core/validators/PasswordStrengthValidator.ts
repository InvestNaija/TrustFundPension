import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value || '';

  if (!value) {
    return null;
  }
  const upperCaseCharacters = /[A-Z]+/g;
  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: `Password must at least contain a capital letter`,
    };
  }
  const numberCharacters = /[0-9]+/g;
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `Password must contain at least a number` };
  }
  const specialCharacters = /[!@#$%^&.?]+/;
  if (specialCharacters.test(value) === false) {
    return {
      passwordStrength: `Password must contain at least one special character`,
    };
  }
  return null;
}

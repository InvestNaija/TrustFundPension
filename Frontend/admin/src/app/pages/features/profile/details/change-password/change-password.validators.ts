export const ValidationMessages = {
  currentPassword: {
    required: 'Password is required',
  },
  newPassword: {
    required: 'Password is required',
    minlength: 'Password should not be less than 6 characters',
    passwordStrength:
      'Password must contain at least a capital letter, a number, and a special character',
  },
  confirmNewPassword: {
    required: 'Password is required',
  },

};

export let FormErrors = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

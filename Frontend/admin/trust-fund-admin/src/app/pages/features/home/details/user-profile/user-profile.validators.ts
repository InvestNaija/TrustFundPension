export const ValidationMessages = {
  pen: {
    required: 'Pension number is required',
  },
  email: {
    required: 'Email is required',
    pattern: 'Enter valid email'
  },
  category: {
    required: 'Category is required',
  },
  address: {
    required: 'Business Address is required'
  },
  phone: {
    required: 'Phone number is required'
  }
};
export let FormErrors = {
  pen: '',
  email: '',
  category: '',
  address: '',
  phone: ''
};

export interface SignUp {
  pen: string;
  email: string;
  category: string;
  address: string;
  phone: string;
}

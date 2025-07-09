export const ValidationMessages = {
  pen: {
    required: 'Pension number is required',
  },
  email: {
    required: 'Email is required',
    pattern: 'Enter valid email'
  },
  nin: {
    required: 'NIN is required',
  },
  bvn: {
    required: 'BNV is required',
  },
  address: {
    required: 'Business Address is required'
  },
  phone: {
    required: 'Phone number is required'
  },
  next_of_kin_relationship: {
    required: 'Next of kin relationship is required'
  },
  next_of_kin_phone: {
    required: 'Next of kin phone is required'
  },
  accountType: {
    required: 'Account type is required'
  },
  name: {
    required: 'Name is required'
  },
  natureOfBusiness: {
    required: 'Nature of business is required'
  },
  rcNumber: {
    required: 'RC number is required'
  },
  initialDate: {
    required: 'Initial date is required'
  },
  AGENT_NAME: {
    required: 'Account manager name is required'
  },
  AGENT_PHONE: {
    required: 'Account manager phone is required'
  },
};
export let FormErrors = {
  pen: '',
  bvn: '',
  nin: '',
  email: '',
  category: '',
  address: '',
  phone: '',
  next_of_kin_relationship: '',
  next_of_kin_phone: '',
  accountType: '',
  name: '',
  natureOfBusiness: '',
  rcNumber: '',
  initialDate: '',
  AGENT_NAME: '',
  AGENT_PHONE: ''
};

export interface SignUp {
  pen: string;
  bvn: string;
  nin: string;
  email: string;
  category: string;
  address: string;
  phone: string;
  next_of_kin_relationship: string;
  next_of_kin_phone: string;
  accountType: string;
  name: string;
  natureOfBusiness: string;
  rcNumber: string;
  initialDate: string;
  AGENT_NAME: string;
  AGENT_PHONE: string;
}

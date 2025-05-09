export interface IVerifyMeBvnResponse {
  status: boolean;
  message: string;
  data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
  };
} 
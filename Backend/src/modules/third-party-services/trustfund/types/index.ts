export interface IEmailRequest {
  to: string;
  subject: string;
  body: string;
  from: string;
  from_name: string;
}

export interface IEmailResponse {
  status: string;
  message: string;
}

export interface ISmsRequest {
  username: string;
  password: string;
  msisdn: string;
  msg: string;
  sender: string;
}

export interface ISmsResponse {
  status: string;
  response: {
    results: Array<{
      msisdn: string;
      smscount: string;
      code: string;
      reason: string;
      ticket: string;
    }>;
  };
}

export interface IFundType {
  scheme_ID: string;
  scheme_name: string;
}

export interface IContribution {
  Date: string;
  EMPLOYEE_CONTRIBUTION: string;
  EMPLOYER_CONTRIBUTION: string;
  OTHER_CONTRIBUTION: string;
}

export interface IContributionRequest {
  pin: string;
}

export interface IAccountManagerRequest {
  rsa_number: string;
}

export interface IAccountManager {
  AGENT_NAME: string;
  AGENT_PHONE: string | null;
}

export interface ILoginResponse {
  access_token: string;
}

export interface ISummaryRequest {
  pin: string;
}

export interface IBioData {
  pin: string;
  firstname: string;
  surname: string;
  othernames: string;
  email: string;
  mobilePhone: string;
  title: string;
  gender: string;
  dateOfBirth: number;
  permanentAddress: string;
  employerName: string;
  nokMobilePhone: string;
  nokAddress: string;
  nokSurname: string;
  nokOthername: string;
  nokRelationship: string;
  nokName: string;
  nokEmailaddress: string;
  nok2Firstname: string;
  nok2Surname: string;
  nok2Othername: string;
  nok2Relationship: string;
  nok2Mobilephone: string;
  nok2Emailaddress: string;
  nok2Address: string;
  fundId: string | null;
  fundName: string | null;
}

export interface ISummaryResponse {
  totalContributionMandatory: number;
  totalFeesMandatory: number;
  totalUnitMandatory: number;
  netContributionMandatory: number;
  totalContributionVoluntary: number;
  totalFeesVoluntary: number;
  totalUnitVoluntary: number;
  netContributionVoluntary: number;
  totalWithdrawalMandatory: number;
  totalWithdrawalVoluntary: number;
  totalWithdrwal: number;
  totalBalance: number;
  balanceBF: number | null;
  balanceCL: number | null;
  unitPrice: number;
  balanceMandatory: number;
  growthMandatory: number;
  balanceVoluntary: number;
  growthVoluntary: number;
  schemeName: string;
  fundId: string;
  bioData: IBioData;
  contributions: any | null;
  priceList: any | null;
  price: number;
}

export interface ICustomerOnboardingRequest {
  formRefno: string;
  schemeId: string;
  ssn: string;
  gender: string;
  title: string;
  firstname: string;
  surname: string;
  maritalStatusCode: string;
  placeOfBirth: string;
  mobilePhone: string;
  permanentAddressLocation: string;
  nationalityCode: string;
  stateOfOrigin: string;
  lgaCode: string;
  permCountry: string;
  permState: string;
  permLga: string;
  permCity: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
  othernames: string;
  maidenName: string;
  email: string;
  permanentAddress: string;
  permBox: string;
  permanentAddress1: string;
  permZip: string;
  employerType: string;
  employerRcno: string;
  dateOfFirstApointment: string;
  employerLocation: string;
  employerCountry: string;
  employerStatecode: string;
  employerLga: string;
  employerCity: string;
  employerBusiness: string;
  employerAddress1: string;
  employerAddress: string;
  employerZip: string;
  employerBox: string;
  employerPhone: string;
  nokTitle: string;
  nokName: string;
  nokSurname: string;
  nokGender: string;
  nokRelationship: string;
  nokLocation: string;
  nokCountry: string;
  nokStatecode: string;
  nokLga: string;
  nokCity: string;
  nokOthername: string;
  nokAddress1: string;
  nokAddress: string;
  nokZip: string;
  nokEmailaddress: string;
  nokBox: string;
  nokMobilePhone: string;
  pictureImage: string;
  formImage: string;
  signatureImage: string;
  stateOfPosting: string;
  agentCode: string;
  dateOfBirth: string;
}

export interface IGenerateReportRequest {
  pin: string;
  toDate: string;
  fromDate: string;
}

export interface IWelcomeLetterRequest {
  pin: string;
}
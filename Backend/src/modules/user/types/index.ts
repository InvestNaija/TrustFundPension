export enum AGENT_ACCOUNT_TYPE {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

export interface IAgent {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  accountType: AGENT_ACCOUNT_TYPE;
  businessCertificateUrl?: string;
  companyName?: string;
}

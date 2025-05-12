export enum ENV {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum EVENT {
  SEND_EMAIL = 'send.email',
}

export enum EMAIL_TEMPLATE {
  LAYOUT = 'layout',
  EMAIL_VERIFICATION_OTP = 'email-verification-otp',
  PASSWORD_RESET_OTP = 'password-reset-otp',
  INVITE = 'invite',
  AGENT_APPROVED = 'agent-approved',
  AGENT_REJECTED = 'agent-rejected',
  CREDIT_MONITORING_ALERT = 'credit-monitoring-alert',
}

export enum JWT_TOKEN_TYPE {
  ACCESS_TOKEN = 'jwt-access-token',
  REFRESH_TOKEN = 'jwt-refresh-token',
}

export enum USER_ROLE {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export enum ACCOUNT_TYPE {
  RSA = 'RSA',
  MICRO_PENSION = 'MICRO_PENSION'
}

export enum UPLOAD_TYPE {
  NIN = 'NIN',
  VOTERS_CARD = 'VOTERS_CARD',
  INTERNATIONAL_PASSPORT = 'INTERNATIONAL_PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  BANK_STATEMENT = 'BANK_STATEMENT',
  UTILITY_BILL = 'UTILITY_BILL',
  PASSPORT_PHOTO = 'PASSPORT_PHOTO',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  OTHER = 'OTHER'
}

export const PRESIGNED_URL_EXPIRY = 3600; // 1 hour

export const INVITE_EXPIRY_DAYS = 3;

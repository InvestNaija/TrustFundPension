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
  AGENT = 'agent',
  CLIENT = 'client',
  ADMIN = 'admin',
  AGENT_STAFF = 'agentStaff',
}

export const PRESIGNED_URL_EXPIRY = 3600; // 1 hour

export const INVITE_EXPIRY_DAYS = 3;

import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import { HttpRequestService } from '../../../shared/http-request';
import {
  IEmailRequest,
  IEmailResponse,
  ISmsRequest,
  ISmsResponse,
  IFundType,
  IContribution,
  IContributionRequest,
  IAccountManagerRequest,
  IAccountManager,
  ILoginResponse,
  ISummaryRequest,
  ISummaryResponse,
  ICustomerOnboardingRequest,
  IGenerateReportRequest,
  IWelcomeLetterRequest,
} from './types';

@Injectable()
export class TrustFundService {
  private logger = new Logger(TrustFundService.name);
  private accessToken: string | null = null;

  // Email credentials
  private readonly EMAIL_FROM = envConfig.TRUSTFUND_EMAIL_FROM;
  private readonly EMAIL_FROM_NAME = envConfig.TRUSTFUND_EMAIL_FROM_NAME;

  // SMS credentials
  private readonly SMS_USERNAME = envConfig.TRUSTFUND_SMS_USERNAME;
  private readonly SMS_PASSWORD = envConfig.TRUSTFUND_SMS_PASSWORD;
  private readonly SMS_SENDER = envConfig.TRUSTFUND_SMS_SENDER;

  constructor(private readonly httpRequest: HttpRequestService) {}

  private getRequestHeaders(withAuth = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!withAuth) {
      headers.Authorization = `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`;
    } else if (this.accessToken) {
      headers.Authorization = `${this.accessToken}`;
    }

    return headers;
  }

  async login(): Promise<void> {
    try {
      const url = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/partnerservice/auth/login`;
      const headers = this.getRequestHeaders(false);  
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers,
      });
      this.accessToken = response.authorization;
    } catch (error) {
      this.logger.error('Error during login:', error);
      throw new UnprocessableEntityException('Could not authenticate');
    }
  }

  async sendEmail(emailData: IEmailRequest): Promise<IEmailResponse> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}/mobile/sendemail.php`;
      const emailPayload = {
        ...emailData,
        from: this.EMAIL_FROM,
        from_name: this.EMAIL_FROM_NAME,
      };
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: emailPayload,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new UnprocessableEntityException('Could not send email');
    }
  }

  async sendSms(smsData: ISmsRequest): Promise<ISmsResponse> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}/mobile/sendsms.php`;
      const smsPayload = {
        ...smsData,
        username: this.SMS_USERNAME,
        password: this.SMS_PASSWORD,
        sender: this.SMS_SENDER,
      };
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: smsPayload,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
      throw new UnprocessableEntityException('Could not send SMS');
    }
  }

  async getFundTypes(): Promise<IFundType[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}/api/get_schemes.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error getting fund types:', error);
      throw new UnprocessableEntityException('Could not get fund types');
    }
  }

  async getLastTenContributions(data: IContributionRequest): Promise<IContribution[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}/api/get_contributions.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error getting contributions:', error);
      throw new UnprocessableEntityException('Could not get contributions');
    }
  }

  async getAccountManager(data: IAccountManagerRequest): Promise<IAccountManager[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}/api/get_agent.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error getting account manager:', error);
      throw new UnprocessableEntityException('Could not get account manager');
    }
  }

  async getSummary(data: ISummaryRequest): Promise<ISummaryResponse> {
    try {
      await this.login();
      const url = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/partnerservice/getsummary`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error getting summary:', error);
      throw new UnprocessableEntityException('Could not get summary');
    }
  }

  async customerOnboarding(data: ICustomerOnboardingRequest): Promise<any> {
    try {
      await this.login();
      const url = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/regmodule-ecrs/onboarding`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
      });
    } catch (error) {
      this.logger.error('Error during customer onboarding:', error);
      throw new UnprocessableEntityException('Could not complete customer onboarding');
    }
  }

  async generateReport(data: IGenerateReportRequest): Promise<Buffer> {
    try {
      await this.login();
      const url = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/partnerservice/generate/report-pin`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
        responseType: 'arraybuffer'
      });
      return Buffer.from(response);
    } catch (error) {
      this.logger.error('Error generating report:', error);
      throw new UnprocessableEntityException('Could not generate report');
    }
  }

  async generateWelcomeLetter(data: IWelcomeLetterRequest): Promise<Buffer> {
    try {
      await this.login();
      const url = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/partnerservice/generate/welcome-letter`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: this.getRequestHeaders(),
        responseType: 'arraybuffer'
      });
      return Buffer.from(response);
    } catch (error) {
      this.logger.error('Error generating welcome letter:', error);
      throw new UnprocessableEntityException('Could not generate welcome letter');
    }
  }
}

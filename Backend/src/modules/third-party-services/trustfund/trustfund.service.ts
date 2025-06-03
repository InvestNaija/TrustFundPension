import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import { HttpRequestService } from '../../../shared/http-request';
import { IApiResponse } from 'src/core/types';
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
  IEmployerRequest,
  ISummaryRequest,
  ISummaryResponse,
  ICustomerOnboardingRequest,
  IGenerateReportRequest,
  IWelcomeLetterRequest,
  IUnremittedContributionsRequest,
} from './types';

@Injectable()
export class TrustFundService {
  private logger = new Logger(TrustFundService.name);

  // Email credentials
  private readonly EMAIL_FROM = envConfig.TRUSTFUND_EMAIL_FROM;
  private readonly EMAIL_FROM_NAME = envConfig.TRUSTFUND_EMAIL_FROM_NAME;

  // SMS credentials
  private readonly SMS_USERNAME = envConfig.TRUSTFUND_SMS_USERNAME;
  private readonly SMS_PASSWORD = envConfig.TRUSTFUND_SMS_PASSWORD;
  private readonly SMS_SENDER = envConfig.TRUSTFUND_SMS_SENDER;

  constructor(private readonly httpRequest: HttpRequestService) {}

  async sendEmail(emailData: IEmailRequest): Promise<IEmailResponse> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}mobile/sendemail.php`;
      const emailPayload = {
        ...emailData,
        from: this.EMAIL_FROM,
        from_name: this.EMAIL_FROM_NAME,
      };
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: emailPayload,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new UnprocessableEntityException('Could not send email');
    }
  }

  async sendSms(smsData: ISmsRequest): Promise<ISmsResponse> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}mobile/sendsms.php`;
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
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
      throw new UnprocessableEntityException('Could not send SMS');
    }
  }

  async getFundTypes(): Promise<IFundType[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}api/get_schemes.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error getting fund types:', error);
      throw new UnprocessableEntityException('Could not get fund types');
    }
  }


  async getEmployers(data: IEmployerRequest ) {
    try {
      const url = `${envConfig.TRUSTFUND_URL}api/get_employer_details.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error getting employer details:', error);
      throw new UnprocessableEntityException('Could not get employer details');
    }
  }

  async getLastTenContributions(data: IContributionRequest): Promise<IContribution[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}api/get_contributions.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error getting contributions:', error);
      throw new UnprocessableEntityException('Could not get contributions');
    }
  }

  async getAccountManager(data: IAccountManagerRequest): Promise<IAccountManager[]> {
    try {
      const url = `${envConfig.TRUSTFUND_URL}api/get_agent.php`;
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error getting account manager:', error);
      throw new UnprocessableEntityException('Could not get account manager');
    }
  }

  async getSummary(data: ISummaryRequest): Promise<ISummaryResponse> {
    try {
      const loginUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/auth/login`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
      };    
      return this.httpRequest.makeRequest({
        method: 'POST',
        url: loginUrl,
        headers,
      }).then(response => {
        const summaryUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/getsummary`;
        return this.httpRequest.makeRequest({
          method: 'POST',
          url: summaryUrl,
          data,
          headers:{
            'Content-Type': 'application/json',
            'Authorization': response.authorization
          },
        });
      });
    } catch (error) {
      this.logger.error('Error getting summary:', error);
      throw new UnprocessableEntityException('Could not get summary');
    }
  }

  async customerOnboarding(data: ICustomerOnboardingRequest): Promise<any> {
    try {
      const loginUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/auth/login`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
      };
      
      return this.httpRequest.makeRequest({
        method: 'POST',
        url: loginUrl,
        headers,
      }).then(response => {
        const onboardingUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/regmodule-ecrs/onboarding`;
        return this.httpRequest.makeRequest({
          method: 'POST',
          url: onboardingUrl,
          data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': response.authorization
          },
        });
      });
    } catch (error) {
      this.logger.error('Error during customer onboarding:', error);
      throw new UnprocessableEntityException('Could not complete customer onboarding');
    }
  }

  async generateReport(data: IGenerateReportRequest): Promise<Buffer> {
    try {
      const loginUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/auth/login`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
      };
      
      return this.httpRequest.makeRequest({
        method: 'POST',
        url: loginUrl,
        headers,
      }).then(response => {
        const reportUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/generate/report-pin`;
        return this.httpRequest.makeRequest({
          method: 'POST',
          url: reportUrl,
          data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': response.authorization
          },
          responseType: 'arraybuffer'
        }).then(reportResponse => Buffer.from(reportResponse));
      });
    } catch (error) {
      this.logger.error('Error generating report:', error);
      throw new UnprocessableEntityException('Could not generate report');
    }
  }

  async generateWelcomeLetter(data: IWelcomeLetterRequest): Promise<Buffer> {
    try {
      const loginUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/auth/login`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
      };
      
      return this.httpRequest.makeRequest({
        method: 'POST',
        url: loginUrl,
        headers,
      }).then(response => {
        const letterUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/generate/welcome-letter`;
        return this.httpRequest.makeRequest({
          method: 'POST',
          url: letterUrl,
          data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': response.authorization
          },
          responseType: 'arraybuffer'
        }).then(letterResponse => Buffer.from(letterResponse));
      });
    } catch (error) {
      this.logger.error('Error generating welcome letter:', error);
      throw new UnprocessableEntityException('Could not generate welcome letter');
    }
  }

  async generateUnremittedContributions(data: IUnremittedContributionsRequest): Promise<Buffer> {
    try {
      const loginUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/auth/login`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
      };
      
      return this.httpRequest.makeRequest({
        method: 'POST',
        url: loginUrl,
        headers,
      }).then(response => {
        const unremittedContributionsUrl = `${envConfig.TRUSTFUND_BASE_URL}pensionserver-web/rest/partnerservice/contribution/generate-list/missing-month-by-pin`;
        return this.httpRequest.makeRequest({
          method: 'POST',
          url: unremittedContributionsUrl,
          data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': response.authorization
          },
          responseType: 'arraybuffer'
        }).then(response => Buffer.from(response));
      });
    } catch (error) {
      this.logger.error('Error generating unremitted contributions:', error);
      throw new UnprocessableEntityException('Could not generate unremitted contributions');
    }
  }

  async generateEmbassyLetterUrl(data: { surname: string; mobile: string; dateOfBirth: string }){
    try {
      const baseUrl = `${envConfig.TRUSTFUND_SERVICE_URL}request_letter`;
      const queryParams = new URLSearchParams({
        Surname: data.surname,
        Mobile: data.mobile,
        DateOfBirth: data.dateOfBirth
      });
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      return await this.httpRequest.makeRequest({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error generating embassy letter:', error);
      throw new UnprocessableEntityException('Could not generate embassy letter');
    }
  }
}

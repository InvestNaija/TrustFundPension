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
  IEmployerRequest,
  ISummaryRequest,
  ISummaryResponse,
  ICustomerOnboardingRequest,
  IGenerateReportRequest,
  IWelcomeLetterRequest,
  IUnremittedContributionsRequest,
  IEmbassyLetterRequest,
  IEmbassy,
  ISignedNotFundedDto,
  IRSARegisteredYearFundedDto,
  IRSANotFundedByEndLastYearFundedThisYearDto,
  IRSANotFundedAtLeastFourYrsDto,
  IFundPricesPercentageGrowthDuringYearDto,
  IActiveDto,
  IInActiveDto,
  IMicroPensionContributionDto,
  IVoluntaryContributionDto
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
      const formData = new FormData();
      
      // Add all email data to FormData
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('body', emailData.body);
      formData.append('from', this.EMAIL_FROM || '');
      formData.append('from_name', this.EMAIL_FROM_NAME || '');
      
      // Add attachment if provided
      if (emailData.attachment) {
        formData.append('attachment', emailData.attachment);
      }
      
      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
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

  async getEmbassyLetter(data: IEmbassyLetterRequest):  Promise<Buffer> {
    try {
      const baseUrl = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/embassy/embassy-letter`;
      const queryParams = new URLSearchParams({
        PIN: data.pin,
        EmbassyID: data.embassyId.toString()
      });
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      return await this.httpRequest.makeRequest({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }).then(letterResponse => Buffer.from(letterResponse));
    } catch (error) {
      this.logger.error('Error getting contributions:', error);
      throw new UnprocessableEntityException('Could not get embassey letter');
    }
  }

  async getEmbassy(): Promise<IEmbassy[]> {
    try {
      const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/embassy/embassylist`;
      return await this.httpRequest.makeRequest({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      this.logger.error('Error getting embassy list:', error);
      throw new UnprocessableEntityException('Could not get embassy list');
    }
  }

  async sendFiles(file: Express.Multer.File): Promise<{
    success: boolean;
    message: string;
    fileName: string;
    relativePath: string;
    publicUrl: string;
  }> {
    try {
      const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Imageupload/upload`;
      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('image', blob, file.originalname);

      return await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw new UnprocessableEntityException('Could not upload file');
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
            'Authorization': `Basic ${Buffer.from(`${envConfig.TRUSTFUND_USERNAME}:${envConfig.TRUSTFUND_PASSWORD}`).toString('base64')}`
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

  async getSignedNotFunded(): Promise<ISignedNotFundedDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/Signed-NotFunded`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getRSARegisteredYearFunded(): Promise<IRSARegisteredYearFundedDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/RSARegisteredYear-Funded`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getRSANotFundedByEndLastYearFundedThisYear(): Promise<IRSANotFundedByEndLastYearFundedThisYearDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/RSANotFunded-By31DecLastYear-FundedAtLeastOnceThisyear`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getRSANotFundedAtLeastFourYrs(): Promise<IRSANotFundedAtLeastFourYrsDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/RSANotFunded-AtLeastFourYrs`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getFundPricesPercentageGrowthDuringYear(): Promise<IFundPricesPercentageGrowthDuringYearDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/FundPricesPercentageGrowth-During-Year`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getActive(): Promise<IActiveDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/Active`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getInActive(): Promise<IInActiveDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/InActive`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getMicroPensionContribution(): Promise<IMicroPensionContributionDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/MicroPensionContribution`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }

  async getVoluntaryContribution(): Promise<IVoluntaryContributionDto> {
    const url = `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Admin/VoluntaryContribution`;
    return this.httpRequest.makeRequest({ method: 'GET', url });
  }
  
}

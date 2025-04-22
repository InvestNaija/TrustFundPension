import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ISendEmailConfig } from './types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(sendEmailConfig: ISendEmailConfig) {
    try {
      const result = await this.mailerService.sendMail({
        to: sendEmailConfig.to,
        subject: sendEmailConfig.subject,
        template: sendEmailConfig.template,
        context: {
          ...sendEmailConfig.templateData,
        },
        attachments: sendEmailConfig.attachments,
      });

      this.logger.log(`Email sent successfully`);

      return result;
    } catch (error) {
      this.logger.error(`Unable to send email: ${error.message}`);

      throw new UnprocessableEntityException(error.message);
    }
  }
}

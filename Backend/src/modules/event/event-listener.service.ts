import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs/promises';
import { EmailService, getEmailTemplatesPath } from '../../shared/email';
import { OnEvent } from '@nestjs/event-emitter';
import { EMAIL_TEMPLATE, EVENT } from '../../core/constants';
import { ISendEmailConfig } from '../../shared/email/types';

@Injectable()
export class EventListenerService {
  private readonly logger: Logger = new Logger(EventListenerService.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EVENT.SEND_EMAIL, { async: true })
  async sendEmail(sendEmailConfig: ISendEmailConfig) {
    this.logger.log(
      `${EVENT.SEND_EMAIL} event received. using ${sendEmailConfig.template} template...`,
    );

    const layoutTemplateHtmlContent =
      await this.generateEmailLayoutTemplateHtmlContent(
        sendEmailConfig.template,
        sendEmailConfig.templateData,
      );

    return await this.emailService.sendEmail({
      to: sendEmailConfig.to,
      subject: sendEmailConfig.subject,
      template: EMAIL_TEMPLATE.LAYOUT,
      templateData: { content: layoutTemplateHtmlContent },
    });
  }

  async generateEmailLayoutTemplateHtmlContent(
    templateName: string,
    templateData: Record<string, any>,
  ) {
    try {
      const templatePath = path.resolve(
        `${getEmailTemplatesPath()}/${templateName}.hbs`,
      );

      const templateContent = await fs.readFile(templatePath, 'utf-8');

      const template = Handlebars.compile(templateContent);

      const htmlContent = template(templateData);

      return htmlContent;
    } catch (error) {
      this.logger.error(
        `Error processing email layout template html content: ${error}`,
      );

      throw new UnprocessableEntityException(
        `Error processing email layout template html content`,
      );
    }
  }
}

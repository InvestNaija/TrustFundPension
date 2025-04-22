import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { envConfig } from '../../core/config';
import * as path from 'path';
import * as fs from 'fs';
import { EmailService } from './email.service';

export const getEmailTemplatesPath = () => {
  const templatesPaths = [
    path.resolve('/app/dist/views/email-templates'), // Docker production path
    path.resolve('/app/src/views/email-templates'), // Docker development path
    path.resolve(process.cwd(), 'dist/views/email-templates'), // Local production
    path.resolve(process.cwd(), 'src/views/email-templates'), // Local development
  ];

  for (const templatePath of templatesPaths) {
    try {
      fs.accessSync(templatePath, fs.constants.R_OK);
      console.log(`Using email templates path: ${templatePath}`);
      return templatePath;
    } catch (error) {
      continue;
    }
  }

  throw new Error(
    `Could not locate email templates directory. Attempted paths: ${templatesPaths.join('\n')} Current working directory: ${process.cwd()}`,
  );
};

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envConfig.SMTP_HOST,
        port: Number(envConfig.SMTP_PORT),
        auth: {
          user: envConfig.SMTP_USERNAME,
          pass: envConfig.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `Credit Veto <${envConfig.SMTP_FROM_EMAIL}>`,
      },
      template: {
        dir: getEmailTemplatesPath(),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

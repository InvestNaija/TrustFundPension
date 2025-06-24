import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  envValidationSchema,
  initializeSchema,
} from './core/config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database';
import { UserModule } from './modules/user';
import { PensionModule} from './modules/pension';
import { ThirdPartyServicesModule } from './modules/third-party-services';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth';
import { ReferralModule } from './modules/referral';
import { ContactUsModule } from './modules/contact-us';
import { MediaModule } from './modules/media';
import { BranchModule } from './modules/branch/branch.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReferenceDataModule } from './modules/reference-data/reference-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      validationSchema: envValidationSchema,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    DatabaseModule,
    ThirdPartyServicesModule,
    PensionModule,
    ReferralModule,
    ContactUsModule,
    MediaModule,
    BranchModule,
    NotificationModule,
    ReferenceDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await initializeSchema();
  }
}

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
    PensionModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await initializeSchema();
  }
}

import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  envValidationSchema,
  initializeSchema,
} from './core/config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database';
import { UserModule } from './modules/user';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      validationSchema: envValidationSchema,
    }),
    UserModule,
    DatabaseModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await initializeSchema();
  }
}

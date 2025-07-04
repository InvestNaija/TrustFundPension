import { Module } from '@nestjs/common';
import { ReferenceDataController } from './controllers/reference-data.controller';
import { ReferenceDataService } from './services/reference-data.service';
import { HttpRequestModule } from '../../shared/http-request/http-request.module';

@Module({
  imports: [HttpRequestModule],
  controllers: [ReferenceDataController],
  providers: [ReferenceDataService],
  exports: [ReferenceDataService],
})
export class ReferenceDataModule {} 
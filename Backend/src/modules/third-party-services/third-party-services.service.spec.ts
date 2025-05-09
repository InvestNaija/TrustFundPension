import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyServicesModule } from './third-party-services.module';
import { TrustFundService } from './trustfund';
import { HttpRequestModule } from '../../shared/http-request';
import { ConfigModule } from '@nestjs/config';

describe('ThirdPartyServicesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ThirdPartyServicesModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide TrustFundService', () => {
    const service = module.get<TrustFundService>(TrustFundService);
    expect(service).toBeDefined();
  });

  it('should import HttpRequestModule', async () => {
    const importedModules = module.get(HttpRequestModule);
    expect(importedModules).toBeDefined();
  });
});

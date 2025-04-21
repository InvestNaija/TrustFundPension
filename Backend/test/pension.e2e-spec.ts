import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionModule } from '../src/modules/pension/pension.module';
import { getTestDatabaseConfig } from './database.config';
import { ValidationPipe } from '@nestjs/common';

describe('PensionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        PensionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/pension/send-email (POST)', () => {
    it('should send email successfully', () => {
      return request(app.getHttpServer())
        .post('/pension/send-email')
        .send({
          to: 'test@example.com',
          subject: 'Test Subject',
          body: 'Test Body',
          from: 'from@example.com',
          from_name: 'Test Sender',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Email sent successfully');
        });
    });

    it('should fail with invalid email data', () => {
      return request(app.getHttpServer())
        .post('/pension/send-email')
        .send({
          to: 'invalid-email',
          subject: '',
          body: '',
          from: 'invalid-email',
          from_name: '',
        })
        .expect(400);
    });
  });

  describe('/pension/send-sms (POST)', () => {
    it('should send SMS successfully', () => {
      return request(app.getHttpServer())
        .post('/pension/send-sms')
        .send({
          username: 'testuser',
          password: 'testpass',
          msisdn: '1234567890',
          msg: 'Test Message',
          sender: 'TestSender',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'SMS sent successfully');
        });
    });

    it('should fail with invalid SMS data', () => {
      return request(app.getHttpServer())
        .post('/pension/send-sms')
        .send({
          username: '',
          password: '',
          msisdn: '',
          msg: '',
          sender: '',
        })
        .expect(400);
    });
  });

  describe('/pension/fund-types (GET)', () => {
    it('should get fund types successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/fund-types')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Fund types retrieved successfully');
          expect(res.body.data).toHaveProperty('fundTypes');
        });
    });
  });

  describe('/pension/contributions/:pin (GET)', () => {
    it('should get contributions successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/contributions/12345')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Contributions retrieved successfully');
          expect(res.body.data).toHaveProperty('contributions');
        });
    });

    it('should fail with invalid pin', () => {
      return request(app.getHttpServer())
        .get('/pension/contributions/')
        .expect(404);
    });
  });

  describe('/pension/onboarding (POST)', () => {
    it('should onboard customer successfully', () => {
      return request(app.getHttpServer())
        .post('/pension/onboarding')
        .send({
          formRefno: 'REF123',
          schemeId: 'SCH123',
          ssn: 'SSN123',
          gender: 'M',
          title: 'Mr',
          firstname: 'John',
          surname: 'Doe',
          maritalStatusCode: 'S',
          placeOfBirth: 'Lagos',
          mobilePhone: '1234567890',
          permanentAddressLocation: 'Lagos',
          nationalityCode: 'NGA',
          stateOfOrigin: 'Lagos',
          lgaCode: 'LGA123',
          permCountry: 'Nigeria',
          permState: 'Lagos',
          permLga: 'LGA123',
          permCity: 'Lagos',
          bankName: 'Test Bank',
          accountNumber: '1234567890',
          accountName: 'John Doe',
          bvn: '12345678901',
          email: 'john@example.com',
          permanentAddress: '123 Test Street',
          employerType: 'Private',
          employerRcno: 'RC123',
          dateOfFirstApointment: '2023-01-01',
          employerLocation: 'Lagos',
          employerCountry: 'Nigeria',
          employerStatecode: 'LAG',
          employerLga: 'LGA123',
          employerCity: 'Lagos',
          employerBusiness: 'Technology',
          employerAddress1: '123 Business Street',
          employerAddress: '123 Business Street',
          employerPhone: '1234567890',
          nokTitle: 'Mrs',
          nokName: 'Jane',
          nokSurname: 'Doe',
          nokGender: 'F',
          nokRelationship: 'Spouse',
          nokLocation: 'Lagos',
          nokCountry: 'Nigeria',
          nokStatecode: 'LAG',
          nokLga: 'LGA123',
          nokCity: 'Lagos',
          nokAddress1: '123 NOK Street',
          nokAddress: '123 NOK Street',
          nokMobilePhone: '1234567890',
          stateOfPosting: 'Lagos',
          agentCode: 'AGT123',
          dateOfBirth: '1990-01-01',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Customer onboarding completed successfully');
        });
    });

    it('should fail with invalid onboarding data', () => {
      return request(app.getHttpServer())
        .post('/pension/onboarding')
        .send({})
        .expect(400);
    });
  });

  describe('/pension/generate-report (GET)', () => {
    it('should generate report successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/generate-report')
        .query({
          pin: '12345',
          fromDate: '2023-01-01',
          toDate: '2023-12-31',
        })
        .expect(200)
        .expect('Content-Type', 'application/pdf')
        .expect('Content-Disposition', 'attachment; filename=pension-report.pdf');
    });

    it('should fail with missing query parameters', () => {
      return request(app.getHttpServer())
        .get('/pension/generate-report')
        .expect(400);
    });

    it('should fail with invalid date format', () => {
      return request(app.getHttpServer())
        .get('/pension/generate-report')
        .query({
          pin: '12345',
          fromDate: 'invalid-date',
          toDate: 'invalid-date',
        })
        .expect(400);
    });
  });

  describe('/pension/welcome-letter/:pin (GET)', () => {
    it('should generate welcome letter successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/welcome-letter/12345')
        .expect(200)
        .expect('Content-Type', 'application/pdf')
        .expect('Content-Disposition', 'attachment; filename=welcome-letter.pdf');
    });

    it('should fail with missing pin', () => {
      return request(app.getHttpServer())
        .get('/pension/welcome-letter/')
        .expect(404);
    });
  });

  describe('/pension/account-manager/:rsa_number (GET)', () => {
    it('should get account manager details successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/account-manager/12345')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Account manager details retrieved successfully');
          expect(res.body.data).toHaveProperty('manager');
        });
    });

    it('should fail with invalid rsa_number', () => {
      return request(app.getHttpServer())
        .get('/pension/account-manager/')
        .expect(404);
    });
  });

  describe('/pension/summary/:pin (GET)', () => {
    it('should get summary successfully', () => {
      return request(app.getHttpServer())
        .get('/pension/summary/12345')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
          expect(res.body).toHaveProperty('message', 'Summary retrieved successfully');
        });
    });

    it('should fail with invalid pin', () => {
      return request(app.getHttpServer())
        .get('/pension/summary/')
        .expect(404);
    });
  });
}); 
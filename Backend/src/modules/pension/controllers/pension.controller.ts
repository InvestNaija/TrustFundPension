import { Body, Controller, Get, Post, Res, HttpStatus, Param, Query } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PensionService } from '../services';
import {
  EmailRequestDto,
  SmsRequestDto,
  ContributionRequestDto,
  AccountManagerRequestDto,
  SummaryRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
} from '../dto';

@ApiTags('Pension')
@Controller('pension')
export class PensionController {
  constructor(private readonly pensionService: PensionService) {}

  @Post('send-email')
  @ApiOperation({ summary: 'Send email notification' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email sent successfully' })
  async sendEmail(@Body() data: EmailRequestDto) {
    return await this.pensionService.sendEmail(data);
  }

  @Post('send-sms')
  @ApiOperation({ summary: 'Send SMS notification' })
  @ApiResponse({ status: HttpStatus.OK, description: 'SMS sent successfully' })
  async sendSms(@Body() data: SmsRequestDto) {
    return await this.pensionService.sendSms(data);
  }

  @Get('fund-types')
  @ApiOperation({ summary: 'Get all fund types' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fund types retrieved successfully' })
  async getFundTypes() {
    return await this.pensionService.getFundTypes();
  }

  @Get('contributions/:pin')
  @ApiOperation({ summary: 'Get last 10 contributions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contributions retrieved successfully' })
  async getLastTenContributions(@Param('pin') pin: string) {
    const data: ContributionRequestDto = { pin };
    return await this.pensionService.getLastTenContributions(data);
  }

  @Get('account-manager/:rsa_number')
  @ApiOperation({ summary: 'Get account manager details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account manager details retrieved successfully' })
  async getAccountManager(@Param('rsa_number') rsa_number: string) {
    const data: AccountManagerRequestDto = { rsa_number };
    return await this.pensionService.getAccountManager(data);
  }

  @Get('summary/:pin')
  @ApiOperation({ summary: 'Get pension account summary' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Summary retrieved successfully' })
  async getSummary(@Param('pin') pin: string) {
    const data: SummaryRequestDto = { pin };
    return await this.pensionService.getSummary(data);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Customer onboarding' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer onboarded successfully' })
  async customerOnboarding(@Body() data: CustomerOnboardingRequestDto) {
    return await this.pensionService.customerOnboarding(data);
  }

  @Get('generate-report')
  @ApiOperation({ summary: 'Generate pension report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report generated successfully' })
  async generateReport(@Query() query: GenerateReportQueryDto, @Res() res: Response) {
    const buffer = await this.pensionService.generateReport(query);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=pension-report.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('welcome-letter/:pin')
  @ApiOperation({ summary: 'Generate welcome letter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Welcome letter generated successfully' })
  async generateWelcomeLetter(@Param('pin') pin: string, @Res() res: Response) {
    const data = { pin };
    const buffer = await this.pensionService.generateWelcomeLetter(data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=welcome-letter.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
} 
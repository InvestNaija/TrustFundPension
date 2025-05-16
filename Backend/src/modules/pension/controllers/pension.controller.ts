import { Body, Controller, Get, Post, Res, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../core/decorators';

@ApiTags('Pension')
@Controller('pension')
@UseGuards(JwtAuthGuard)
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

  @Get('contributions')
  @ApiOperation({ summary: 'Get last 10 contributions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contributions retrieved successfully' })
  async getLastTenContributions(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return await this.pensionService.getLastTenContributions(authenticatedUser.id);
  }

  @Get('account-manager')
  @ApiOperation({ summary: 'Get account manager details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account manager details retrieved successfully' })
  async getAccountManager(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return await this.pensionService.getAccountManager(authenticatedUser.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get pension account summary' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Summary retrieved successfully' })
  async getSummary(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return await this.pensionService.getSummary(authenticatedUser.id);
  }

  @Get('summary/:rsa_pin')
  @ApiOperation({ summary: 'validate rsa pin' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Summary retrieved successfully' })
  async validateRsaPin(@Param('rsa_pin') rsa_pin: string) {
    return await this.pensionService.validateRsaPin(rsa_pin);
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
  async generateReport(@Query() query: GenerateReportQueryDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Res() res: Response) {
    const buffer = await this.pensionService.generateReport(query, authenticatedUser.id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=pension-report.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('welcome-letter')
  @ApiOperation({ summary: 'Generate welcome letter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Welcome letter generated successfully' })
  async generateWelcomeLetter(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Res() res: Response) {
    const buffer = await this.pensionService.generateWelcomeLetter(authenticatedUser.id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=welcome-letter.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
} 
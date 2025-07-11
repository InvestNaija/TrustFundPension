import { Body, Controller, Get, Post, Res, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PensionService } from '../services';
import {
  EmailRequestDto,
  SmsRequestDto,
  GenerateReportQueryDto,
  WelcomeLetterQueryDto,
  EmbassyLetterQueryDto,
  CreateFundTransferDto,
  FundTransferResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../../core/auth/guards/admin-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { IApiResponse } from '../../../core/types';
import { IEmployerRequest } from 'src/modules/third-party-services/trustfund/types';

@ApiTags('Pension')
@Controller('pension')
@ApiBearerAuth()
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
  async getFundTypes(): Promise<IApiResponse> {
    return await this.pensionService.getFundTypes();
  }

  @Get('contributions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get last 10 contributions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contributions retrieved successfully' })
  async getLastTenContributions(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) : Promise<IApiResponse>{
    return await this.pensionService.getLastTenContributions(authenticatedUser.id);
  }

  @Post('employers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get employers details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employers details retrieved successfully' })
  async getEmployerDetails(@Body() data: IEmployerRequest) : Promise<IApiResponse>{
    return await this.pensionService.getEmployerDetails(data);
  }

  
  @Get('account-manager')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get account manager details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account manager details retrieved successfully' })
  async getAccountManager(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<IApiResponse>{
    return await this.pensionService.getAccountManager(authenticatedUser.id);
  }

  @Get('admin/account-manager/:userId')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get pension account details by userid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pension account details retrieved successfully' })
  async getPensionAccountManager(@Param('userId') userId: string): Promise<IApiResponse> {
    return await this.pensionService.getAccountManager(userId);
  }

  @Get('summary/:rsa_pin')
  @ApiOperation({ summary: 'validate rsa pin' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Summary retrieved successfully' })
  async validateRsaPin(@Param('rsa_pin') rsa_pin: string):Promise<IApiResponse> {
    return await this.pensionService.validateRsaPin(rsa_pin);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get pension account summary' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Summary retrieved successfully' })
  async getSummary(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<IApiResponse> {
    return await this.pensionService.getSummary(authenticatedUser.id);
  }

  @Get('generate-report')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate welcome letter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Welcome letter generated successfully' })
  async generateWelcomeLetter(@Query() query: WelcomeLetterQueryDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Res() res: Response) {
    const buffer = await this.pensionService.generateWelcomeLetter(authenticatedUser.id, query.sendToEmail || false);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=welcome-letter.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('embassy-letter')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate embassy letter PDF' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Embassy letter generated successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Unprocessable Entity' })
  async generateEmbassyLetterUser(
    @Query() query: EmbassyLetterQueryDto,
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Res() res: Response
  ) {
    const buffer = await this.pensionService.getEmbassyLetter(authenticatedUser.id, query.embassyId, query.sendToEmail || false);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=unremitted-contributions.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('embassy')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list of all embassies' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Embassies retrieved successfully' })
  async getEmbassy(): Promise<IApiResponse> {
    return await this.pensionService.getEmbassy();
  }

  @Post('fund-transfer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new fund transfer request' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Fund transfer request created successfully', type: FundTransferResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request or user not eligible for requested fund' })
  async createFundTransfer(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() dto: CreateFundTransferDto,
  ): Promise<IApiResponse> {
    return await this.pensionService.createFundTransfer(authenticatedUser.id, dto);
  }

  @Get('unremitted-contributions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate unremitted contributions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Unremitted contributions generated successfully' })
  async generateUnremittedContributions(@Query() query: GenerateReportQueryDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Res() res: Response){
      const buffer = await this.pensionService.generateUnremittedContributions(query, authenticatedUser.id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=unremitted-contributions.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('admin/onboarding/:userId')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Customer onboarding' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer onboarding completed successfully' })
  async customerOnboarding(@Param('userId') userId: string): Promise<IApiResponse> {
    return await this.pensionService.completeOnboarding(userId);
  }

  @Get('admin/signed-not-funded')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get number of customers signed up but not funded their RSA accounts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getSignedNotFunded() {
    return await this.pensionService.getSignedNotFunded();
  }

  @Get('admin/rsa-registered-year-funded')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get RSAs registered this year and funded at least once' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getRSARegisteredYearFunded() {
    return await this.pensionService.getRSARegisteredYearFunded();
  }

  @Get('admin/rsa-not-funded-end-last-year-funded-this-year')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get RSAs not funded by end of last year but funded at least once this year' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getRSANotFundedByEndLastYearFundedThisYear() {
    return await this.pensionService.getRSANotFundedByEndLastYearFundedThisYear();
  }

  @Get('admin/rsa-not-funded-at-least-four-yrs')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get RSAs not funded in at least four years' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getRSANotFundedAtLeastFourYrs() {
    return await this.pensionService.getRSANotFundedAtLeastFourYrs();
  }

  @Get('admin/fund-prices-percentage-growth-during-year')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get percentage growth in unit values of the funds during the period' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getFundPricesPercentageGrowthDuringYear() {
    return await this.pensionService.getFundPricesPercentageGrowthDuringYear();
  }

  @Get('admin/users/active')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get number of active customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active data fetched successfully' })
  async getActive() {
    return await this.pensionService.getActive();
  }

  @Get('admin/users/inactive')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get number of inactive customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Inactive data fetched successfully' })
  async getInActive() {
    return await this.pensionService.getInActive();
  }

  @Get('admin/micro-pension-contribution')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get micro pension contribution data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Micro pension contribution data fetched successfully' })
  async getMicroPensionContribution() {
    return await this.pensionService.getMicroPensionContribution();
  }

  @Get('admin/voluntary-contribution')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get voluntary contribution data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Voluntary contribution data fetched successfully' })
  async getVoluntaryContribution() {
    return await this.pensionService.getVoluntaryContribution();
  }
} 
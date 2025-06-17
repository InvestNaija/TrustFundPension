import { Body, Controller, Get, Post, Res, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PensionService } from '../services';
import {
  EmailRequestDto,
  SmsRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
  CreateFundTransferDto,
  FundTransferResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
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

  // @Post('onboarding')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Customer onboarding' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Customer onboarded successfully' })
  // async customerOnboarding(@Body() data: CustomerOnboardingRequestDto): Promise<IApiResponse> {
  //   return await this.pensionService.customerOnboarding(data);
  // }

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
  async generateWelcomeLetter(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Res() res: Response) {
    const buffer = await this.pensionService.generateWelcomeLetter(authenticatedUser.id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=welcome-letter.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  // @Get('embassy-letter')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Generate embassy letter PDF' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Embassy letter generated successfully' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Unprocessable Entity' })
  // async generateEmbassyLetter(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
  //  return await this.pensionService.getEmbassyLetterUrl(authenticatedUser.id);
  // }

  @Get('embassy-letter')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate embassy letter PDF' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Embassy letter generated successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Unprocessable Entity' })
  async generateEmbassyLetterUser(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Query('embassyId') embassyId: number,
    @Res() res: Response
  ) {
    const buffer = await this.pensionService.getEmbassyLetter(authenticatedUser.id, embassyId);
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

  @Post('onboarding')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Customer onboarding' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer onboarding completed successfully' })
  async customerOnboarding(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<IApiResponse> {
    return await this.pensionService.completeOnboarding(authenticatedUser.id);
  }
} 
import { Controller, Post, Body, UseGuards, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { FundTransferService } from '../services/fund-transfer.service';
import { CreateFundTransferDto, FundTransferResponseDto } from '../dto/fund-transfer.dto';
import { AuthenticatedUser } from '../../../core/decorators';
import { User } from '../../../modules/user/entities/user.entity';

@ApiTags('Fund Transfer')
@Controller('fund-transfer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FundTransferController {
  constructor(private readonly fundTransferService: FundTransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fund transfer request' })
  @ApiResponse({ status: 201, description: 'Fund transfer request created successfully', type: FundTransferResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request or user not eligible for requested fund' })
  async createTransfer(
    @AuthenticatedUser() user: User,
    @Body() dto: CreateFundTransferDto,
  ): Promise<FundTransferResponseDto> {
    return this.fundTransferService.createTransfer(user.id, dto);
  }
} 
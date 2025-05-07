import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { BvnService } from './bvn.service';
import { VerifyBvnDto } from './dto/verify-bvn.dto';
import { GetBvnDetailsDto } from './dto/get-bvn-details.dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../core/decorators';

@Controller('bvn')
@UseGuards(JwtAuthGuard)
export class BvnController {
  constructor(private readonly bvnService: BvnService) {}

  @Post('verify')
  async verifyBvn(@Body() verifyBvnDto: VerifyBvnDto, @AuthenticatedUser() user: IDecodedJwtToken) {
    return this.bvnService.verifyBvn(verifyBvnDto, user.id);
  }

  @Post('details')
  async getBvnDetails(@Body() getBvnDetailsDto: GetBvnDetailsDto, @AuthenticatedUser() user: IDecodedJwtToken) {
    return this.bvnService.getBvnDetails(getBvnDetailsDto, user.id);
  }
} 
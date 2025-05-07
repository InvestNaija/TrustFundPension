import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { NinService } from './nin.service';
import { VerifyNinDto } from './dto/verify-nin.dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { User } from '../../user/entities/user.entity';
import { AuthenticatedUser } from '../../../core/decorators';

@Controller('nin')
@UseGuards(JwtAuthGuard)
export class NinController {
  constructor(private readonly ninService: NinService) {}

  @Post('verify')
  async verifyNin(@Body() verifyNinDto: VerifyNinDto, @AuthenticatedUser() user: User) {
    return this.ninService.verifyNin(verifyNinDto.nin, user.id);
  }

  @Get('details/:nin')
  async getNinDetails(@Param('nin') nin: string) {
    return this.ninService.getNinDetails(nin);
  }
} 
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../services';
import { CreateUserDto, ListUsersDto, ListUsersResponseDto, UpdateUserDto, UserResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { IApiResponse } from 'src/core/types';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get paginated list of courses' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully',type: ListUsersResponseDto })
  listUsers(@Query() query: ListUsersDto): Promise<IApiResponse> {
    return this.userService.listUsers(query);
  }

  @Get('')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  async findOne( @AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<UserResponseDto> {
    return this.userService.findOneUser(authenticatedUser.id);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User Kyc Retrieved successfully' })
  async kycStatus( @AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<IApiResponse> {
    return this.userService.kycStatus(authenticatedUser.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }
}
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRoleService } from '../services';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/core/auth/guards/admin-auth.guard';

@ApiTags('User Roles')
@Controller('user-roles')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user role' })
  @ApiResponse({ status: 201, description: 'User role created successfully', type: UserRoleResponseDto })
  async create(@Body() createUserRoleDto: CreateUserRoleDto): Promise<UserRoleResponseDto> {
    return this.userRoleService.create(createUserRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user roles' })
  @ApiResponse({ status: 200, description: 'User roles retrieved successfully', type: [UserRoleResponseDto] })
  async findAll(): Promise<UserRoleResponseDto[]> {
    return this.userRoleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user role by id' })
  @ApiResponse({ status: 200, description: 'User role retrieved successfully', type: UserRoleResponseDto })
  async findOne(@Param('id') id: string): Promise<UserRoleResponseDto> {
    return this.userRoleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully', type: UserRoleResponseDto })
  async update(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto): Promise<UserRoleResponseDto> {
    return this.userRoleService.update(id, updateUserRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user role' })
  @ApiResponse({ status: 200, description: 'User role deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userRoleService.remove(id);
  }
} 
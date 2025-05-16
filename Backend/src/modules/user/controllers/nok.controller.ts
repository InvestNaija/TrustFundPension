import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NokService } from '../services';
import { CreateNokDto, UpdateNokDto, NokResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';

@ApiTags('Next of Kin')
@Controller('noks')
@UseGuards(JwtAuthGuard)
export class NokController {
  constructor(private readonly nokService: NokService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new next of kin' })
  @ApiResponse({ status: 201, description: 'Next of kin created successfully', type: NokResponseDto })
  async create(@Body() createNokDto: CreateNokDto): Promise<NokResponseDto> {
    return this.nokService.create(createNokDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin retrieved successfully', type: [NokResponseDto] })
  async findAll(): Promise<NokResponseDto[]> {
    return this.nokService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a next of kin by id' })
  @ApiResponse({ status: 200, description: 'Next of kin retrieved successfully', type: NokResponseDto })
  async findOne(@Param('id') id: string): Promise<NokResponseDto> {
    return this.nokService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin updated successfully', type: NokResponseDto })
  async update(@Param('id') id: string, @Body() updateNokDto: UpdateNokDto): Promise<NokResponseDto> {
    return this.nokService.update(id, updateNokDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.nokService.remove(id);
  }
} 
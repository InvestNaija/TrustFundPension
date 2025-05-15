import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactUsService } from '../services/contact-us.service';
import { CreateContactUsDto, UpdateContactUsDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactUs } from '../entities';

@ApiTags('Contact Us')
@ApiBearerAuth()
@Controller('contact-us')
@UseGuards(JwtAuthGuard)
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @ApiOperation({ summary: 'Create new contact form submission' })
  @ApiResponse({ status: 201, description: 'Contact form submitted successfully', type: ContactUs })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  create(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create({
      ...createContactUsDto,
      user: authenticatedUser.id
    });
  }

  @ApiOperation({ summary: 'Get all contact form submissions for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all contact form submissions', type: [ContactUs] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.contactUsService.findAll(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Get contact form submission by ID' })
  @ApiResponse({ status: 200, description: 'Return contact form submission by ID', type: ContactUs })
  @ApiResponse({ status: 404, description: 'Contact form submission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactUsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update contact form submission by ID' })
  @ApiResponse({ status: 200, description: 'Contact form submission updated successfully', type: ContactUs })
  @ApiResponse({ status: 404, description: 'Contact form submission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactUsDto: UpdateContactUsDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.contactUsService.update(id, updateContactUsDto, authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Delete contact form submission by ID' })
  @ApiResponse({ status: 200, description: 'Contact form submission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact form submission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  remove(@Param('id') id: string, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.contactUsService.remove(id, authenticatedUser.id);
  }
} 
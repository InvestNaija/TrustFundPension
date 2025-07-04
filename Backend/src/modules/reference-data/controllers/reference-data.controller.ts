import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReferenceDataService, ReferenceDataItem } from '../services/reference-data.service';

@ApiTags('Reference Data')
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private readonly referenceDataService: ReferenceDataService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of countries with codes and names',
    type: [Object],
    schema: {
      example: [
        { Code: 'NG', Name: 'NIGERIA' },
        { Code: 'US', Name: 'UNITED STATES' }
      ]
    }
  })
  async getCountries(): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getCountries();
  }

  @Get('states')
  @ApiOperation({ summary: 'Get all Nigerian states' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of Nigerian states with codes and names',
    type: [Object],
    schema: {
      example: [
        { Code: 'LA', Name: 'LAGOS' },
        { Code: 'AB', Name: 'ABIA' }
      ]
    }
  })
  async getStates(): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getStates();
  }

  @Get('lgas')
  @ApiOperation({ summary: 'Get LGAs for a specific state' })
  @ApiQuery({ 
    name: 'stateCode', 
    description: 'State code (e.g., LA for Lagos)', 
    example: 'LA',
    required: true 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of LGAs for the specified state',
    type: [Object],
    schema: {
      example: [
        { Code: 'GGE', Name: 'AGEGE' },
        { Code: 'AGL', Name: 'AJEROMI-IFELODUN' }
      ]
    }
  })
  async getLGAs(@Query('stateCode') stateCode: string): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getLGAs(stateCode);
  }

  @Get('titles')
  @ApiOperation({ summary: 'Get all titles' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of titles with codes and names',
    type: [Object],
    schema: {
      example: [
        { Code: 'Mr', Name: 'Mr' },
        { Code: 'Mrs', Name: 'Mrs' }
      ]
    }
  })
  async getTitles(): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getTitles();
  }

  @Get('marital-status')
  @ApiOperation({ summary: 'Get all marital status options' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of marital status options with codes and names',
    type: [Object],
    schema: {
      example: [
        { Code: 'SG', Name: 'SINGLE' },
        { Code: 'MD', Name: 'MARRIED' }
      ]
    }
  })
  async getMaritalStatus(): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getMaritalStatus();
  }

  @Get('nok-relationships')
  @ApiOperation({ summary: 'Get all NOK relationships' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of NOK relationships with codes and descriptions',
    type: [Object],
    schema: {
      example: [
        { transId: '7', description: 'BROTHER' },
        { transId: '10', description: 'SISTER' }
      ]
    }
  })
  async getNOKRelationships(): Promise<ReferenceDataItem[]> {
    return this.referenceDataService.getNOKRelationships();
  }
  
} 
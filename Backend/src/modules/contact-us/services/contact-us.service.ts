import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContactUs } from '../entities';
import { CreateContactUsDto, UpdateContactUsDto } from '../dto';
import { ContactUsRepository } from '../repositories';
import { IApiResponse } from 'src/shared/types';

@Injectable()
export class ContactUsService {
  private readonly logger = new Logger(ContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<IApiResponse> {
    try {
      const { user, ...contactUsData } = createContactUsDto;
      const newContact = await this.contactUsRepository.save({
        ...contactUsData,
        user: { id: user }
      });
      return {
        status: true,
        message: 'Contact us created successfully',
        data: newContact
      };
    } catch (error) {
      this.logger.error(`Error creating contact us: ${error.message}`);
      throw error;
    }
  }

  async findAll(userId: string): Promise<IApiResponse> {
    try {
      this.logger.debug('Fetching all contact us from database...');
      const contactUs = await this.contactUsRepository.find({
        relations: ['user'],
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }
      });
      this.logger.debug(`Found ${contactUs.length} contact us items`);
      return {
        status: true,
        message: 'Contact us entries retrieved successfully',
        data: contactUs
      };
    } catch (error) {
      this.logger.error(`Error finding all contact us: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse> {
    try {
      const contactUs = await this.contactUsRepository.findOne({ 
        where: { id },
        relations: ['user']
      });
      if (!contactUs) {
        throw new NotFoundException(`Contact us with ID ${id} not found`);
      }
      return {
        status: true,
        message: 'Contact us entry retrieved successfully',
        data: contactUs
      };
    } catch (error) {
      this.logger.error(`Error finding contact us: ${error.message}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<IApiResponse> {
    try {
      const contactUs = await this.contactUsRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
      return {
        status: true,
        message: 'Contact us entries retrieved successfully',
        data: contactUs
      };
    } catch (error) {
      this.logger.error(`Error finding contact us by user: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, contactUsDto: Partial<UpdateContactUsDto>, userId: string): Promise<IApiResponse> {
    try {
      const contactUs = await this.contactUsRepository.findOne({ 
        where: { id, user: { id: userId } },
        relations: ['user']
      });
      if (!contactUs) {
        throw new NotFoundException(`Contact us with ID ${id} not found`);
      }

      const { user, ...updateData } = contactUsDto;
      await this.contactUsRepository.update({ id }, updateData);
      const updatedContact = await this.contactUsRepository.findOne({
        where: { id },
        relations: ['user']
      });
      return {
        status: true,
        message: 'Contact us updated successfully',
        data: updatedContact || {}
      };
    } catch (error) {
      this.logger.error(`Error updating contact us: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<IApiResponse> {
    try {
      const result = await this.contactUsRepository.delete({ id, user: { id: userId } });
      if (result.affected === 0) {
        throw new NotFoundException(`Contact us with ID ${id} not found`);
      }
      return {
        status: true,
        message: 'Contact us deleted successfully',
        data: {}
      };
    } catch (error) {
      this.logger.error(`Error removing contact us: ${error.message}`);
      throw error;
    }
  }
} 
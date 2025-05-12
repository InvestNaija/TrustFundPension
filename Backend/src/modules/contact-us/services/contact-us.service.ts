import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContactUs } from '../entities';
import { CreateContactUsDto, UpdateContactUsDto } from '../dto';
import { ContactUsRepository } from '../repositories';

@Injectable()
export class ContactUsService {
  private readonly logger = new Logger(ContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    try {
      const { user, ...contactUsData } = createContactUsDto;
      return await this.contactUsRepository.save({
        ...contactUsData,
        user: { id: user }
      });
    } catch (error) {
      this.logger.error(`Error creating contact us: ${error.message}`);
      throw error;
    }
  }

  async findAll(userId: string): Promise<ContactUs[]> {
    try {
      this.logger.debug('Fetching all contact us from database...');
      const contactUs = await this.contactUsRepository.find({
        relations: ['user'],
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }
      });
      this.logger.debug(`Found ${contactUs.length} contact us items`);
      return contactUs;
    } catch (error) {
      this.logger.error(`Error finding all contact us: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<ContactUs> {
    try {
      const contactUs = await this.contactUsRepository.findOne({ 
        where: { id },
        relations: ['user']
      });
      if (!contactUs) {
        throw new NotFoundException(`Contact us with ID ${id} not found`);
      }
      return contactUs;
    } catch (error) {
      this.logger.error(`Error finding contact us: ${error.message}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<ContactUs[]> {
    try {
      return await this.contactUsRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Error finding contact us by user: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, contactUsDto: Partial<UpdateContactUsDto>, userId: string): Promise<ContactUs> {
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
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Error updating contact us: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const result = await this.contactUsRepository.delete({ id, user: { id: userId } });
      if (result.affected === 0) {
        throw new NotFoundException(`Contact us with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing contact us: ${error.message}`);
      throw error;
    }
  }
} 
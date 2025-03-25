import {
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { User } from '../entities';
  import { UserRepository } from '../repositories';
  
  @Injectable()
  export class UserService {
    private readonly logger = new Logger(UserService.name);
  
    constructor(
      private readonly userRepository: UserRepository,
    ) {}
  
 
    async getClientDetails(
    ){
      return {
        status: true,
        message: 'User details fetched successfully'
      };
    }


  }
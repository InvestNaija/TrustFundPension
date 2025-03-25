import {
    Controller,
    Get,
  } from '@nestjs/common';
  import { UserService } from '../services';
  
  @Controller('users')
  export class UserController {
    constructor(private userService: UserService) {}
  
    @Get('')
    getClientDetails(
    ):any {
      return this.userService.getClientDetails();
    }


  }
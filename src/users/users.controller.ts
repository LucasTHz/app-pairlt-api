import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';
import { CreateUserDTO } from './DTO/CreateUserDTO';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() user: CreateUserDTO) {
    return {
      message: user.name,
      user,
    };
  }
}

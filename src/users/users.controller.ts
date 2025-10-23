import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';

type User = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateBirth: string;
  documentId: string;
};

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() user: User) {
    return {
      message: user.name,
      user,
    };
  }
}

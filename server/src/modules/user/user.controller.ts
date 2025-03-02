import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/modules/user/user.di-tokens';
import { UserRegistrationDTO } from 'src/modules/user/user.dto';
import { IUserService } from 'src/modules/user/user.port';

@Controller()
export class UserHttpController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: UserRegistrationDTO) {
    const data = await this.userService.register(dto);
    return { data };
  }
}

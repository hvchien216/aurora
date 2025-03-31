import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/modules/user/user.di-tokens';
import { UserLoginDTO, UserRegistrationDTO } from 'src/modules/user/user.dto';
import { IUserService } from 'src/modules/user/user.port';

@Controller('rpc')
export class UserRPCHttpController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Post('introspect')
  @HttpCode(HttpStatus.OK)
  async introspect(@Body() dto: { token: string }) {
    const data = await this.userService.introspectToken(dto.token);
    return { data };
  }

  @Post('update-default-workspace')
  @HttpCode(HttpStatus.OK)
  async updateDefaultWorkspace(@Body() dto: { oldSlug: string; slug: string }) {
    try {
      await this.userService.updateDefaultWorkspace(dto);
      return {
        data: true,
      };
    } catch {
      return { data: false };
    }
  }
}

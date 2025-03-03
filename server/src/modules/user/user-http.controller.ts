import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/modules/user/user.di-tokens';
import { UserLoginDTO, UserRegistrationDTO } from 'src/modules/user/user.dto';
import { IUserService } from 'src/modules/user/user.port';
import { ReqWithRequester } from 'src/share';
import { RemoteAuthGuard } from 'src/share/guards/auth.guard';

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

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() dto: UserLoginDTO) {
    const data = await this.userService.login(dto);
    return { data };
  }

  @Get('profile')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async profile(@Request() req: ReqWithRequester) {
    const requester = req.requester;
    const data = await this.userService.profile(requester.sub);
    return { data };
  }
}

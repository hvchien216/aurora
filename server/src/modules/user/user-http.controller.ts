import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/modules/user/user.di-tokens';
import {
  RefreshTokenDTO,
  UserLoginDTO,
  UserRegistrationDTO,
} from 'src/modules/user/user.dto';
import { IUserService } from 'src/modules/user/user.port';
import { ReqWithRequester } from 'src/share';
import { GoogleAuthGuard } from 'src/share/guards';
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

  @Post('auth/rotate-token')
  @HttpCode(HttpStatus.OK)
  async rotateToken(@Body() dto: RefreshTokenDTO) {
    const data = await this.userService.rotateToken(dto);
    return { data };
  }

  @Get('auth/google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return 'Google login';
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleCallback(@Req() req, @Res() res) {
    const user = req.user; // Get authenticated user from Passport

    const { accessToken, refreshToken } =
      await this.userService.generateGGTokens(user.email);

    // Redirect to client with tokens as query params
    // TODO: redirect to client with tokens as query params
    return res.redirect(
      `http://localhost:4001/auth/callback/google?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}

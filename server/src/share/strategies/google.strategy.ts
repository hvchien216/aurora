import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { USER_SERVICE } from 'src/modules/user/user.di-tokens';
import { IUserService } from 'src/modules/user/user.port';
import { AppConfig } from 'src/share/config/config.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<AppConfig>('app').host}${configService.get<string>('GOOGLE_CALLBACK_URL')}`,
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(options: any) {
    return {
      access_type: 'offline', // 👈 Request refreshToken
      prompt: 'consent', // 👈 Ensure user re-authenticates
    };
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.userService.validateGoogleUser({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      username: profile.emails[0].value,
      // picture: profile.photos[0].value,
    });

    done(null, user);

    // return user;
  }
}

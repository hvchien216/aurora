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

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(
      '🚀 ~ GoogleStrategy ~ classGoogleStrategyextendsPassportStrategy ~ profile:',
      profile,
    );
    console.log(
      '🚀 ~ GoogleStrategy ~ classGoogleStrategyextendsPassportStrategy ~ refreshToken:',
      refreshToken,
    );
    console.log(
      '🚀 ~ GoogleStrategy ~ classGoogleStrategyextendsPassportStrategy ~ accessToken:',
      accessToken,
    );

    const user = await this.userService.getOrCreate({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      password: 'some-random-password',
      username: profile.emails[0].value,
      // picture: profile.photos[0].value,
    });

    return user;
    // const { name, emails, photos } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken,
    // };
    // done(null, user);
  }
}

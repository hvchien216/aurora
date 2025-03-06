import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const activate = (await super.canActivate(context)) as boolean;
  //   const request = context.switchToHttp().getRequest();
  //   await super.logIn(request); // 👈 enabled session-based authentication
  //   // ☝️ this adds automatic session login after Google OAuth.
  //   return activate;
  // }
  // NOTICE: ☝️ Currently, we're using JWT tokens for authentication
}

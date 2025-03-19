import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ErrTokenInvalid, ErrUnauthorized } from 'src/share/app-error';
import { ITokenIntrospect } from 'src/share/interface';
import {
  REMOTE_AUTH_GUARD,
  TOKEN_INTROSPECTOR,
} from 'src/share/share.di-tokens';

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

@Injectable()
export class RemoteAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_INTROSPECTOR)
    private readonly tokenIntrospect: ITokenIntrospect,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw ErrUnauthorized;
    }

    try {
      const { payload, isOk, error } =
        await this.tokenIntrospect.introspect(token);

      if (!isOk) {
        throw ErrTokenInvalid.withLog('Token parse failed').withLog(
          error!.message,
        );
      }

      request['requester'] = payload;
    } catch {
      throw ErrUnauthorized;
    }

    return true;
  }
}

@Injectable()
export class RemoteAuthGuardOptional implements CanActivate {
  constructor(
    @Inject(REMOTE_AUTH_GUARD) private readonly authGuard: RemoteAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      return true;
    }

    return this.authGuard.canActivate(context);
  }
}

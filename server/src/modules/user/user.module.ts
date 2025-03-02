import { Module, Provider } from '@nestjs/common';
import { UserService } from './user.service';
import { UserHttpController } from './user.controller';
import {
  TOKEN_PROVIDER,
  USER_REPOSITORY,
  USER_SERVICE,
} from './user.di-tokens';
import { UserPrismaRepository } from './user-prisma.repo';
import { JwtTokenService } from 'src/share/components';

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserPrismaRepository,
  },
];

const services: Provider[] = [{ provide: USER_SERVICE, useClass: UserService }];

const tokenProvider: Provider = {
  provide: TOKEN_PROVIDER,
  useClass: JwtTokenService,
};

@Module({
  controllers: [UserHttpController],
  providers: [...repositories, ...services, tokenProvider],
})
export class UserModule {}

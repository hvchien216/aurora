import { Module, Provider } from '@nestjs/common';
import { UserService } from './user.service';
import { UserHttpController } from './user-http.controller';
import { UserRPCHttpController } from './user-rpc-http.controller';

import {
  TOKEN_PROVIDER,
  USER_REPOSITORY,
  USER_SERVICE,
} from './user.di-tokens';
import { UserPrismaRepository } from './user-prisma.repo';
import { JwtTokenService } from 'src/share/components';
import { ShareModule } from 'src/share/share.module';

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
  imports: [ShareModule],
  controllers: [UserHttpController, UserRPCHttpController],
  providers: [...repositories, ...services, tokenProvider],
})
export class UserModule {}

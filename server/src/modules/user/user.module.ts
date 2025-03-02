import { Module, Provider } from '@nestjs/common';
import { UserService } from './user.service';
import { UserHttpController } from './user.controller';
import { USER_REPOSITORY, USER_SERVICE } from './user.di-tokens';
import { UserPrismaRepository } from './user-prisma.repo';

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserPrismaRepository,
  },
];

const services: Provider[] = [{ provide: USER_SERVICE, useClass: UserService }];

@Module({
  controllers: [UserHttpController],
  providers: [...repositories, ...services],
})
export class UserModule {}

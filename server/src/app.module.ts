import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/share/config/configuration';
import { UserModule } from 'src/modules/user/user.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { LinkModule } from 'src/modules/link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UserModule,
    WorkspaceModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

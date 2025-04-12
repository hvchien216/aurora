import { Module } from '@nestjs/common';
import { ShareModule } from 'src/share/share.module';
import { UploadService } from './upload.service';
import { UploadHttpController } from './upload-http.controller';
import { UPLOAD_SERVICE } from './upload.di-tokens';

@Module({
  imports: [ShareModule],
  controllers: [UploadHttpController],
  providers: [
    {
      provide: UPLOAD_SERVICE,
      useClass: UploadService,
    },
  ],
})
export class UploadModule {}

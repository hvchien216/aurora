import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { File, IUploadService } from './upload.port';
import { Inject } from '@nestjs/common';
import { UPLOAD_SERVICE } from './upload.di-tokens';
import { GetSignedUrlDTO, getSignedUrlDTOSchema } from './upload.dto';
import { RemoteAuthGuard } from 'src/share/guards';

@Controller('upload')
@UseGuards(RemoteAuthGuard)
export class UploadHttpController {
  constructor(
    @Inject(UPLOAD_SERVICE) private readonly uploadService: IUploadService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: File) {
    const data = await this.uploadService.uploadSingle(file);
    return { data };
  }

  @Post('multiple')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: File[]) {
    const data = await this.uploadService.uploadMultiple(files);
    return { data };
  }

  @Post('signed-url')
  @HttpCode(HttpStatus.OK)
  async getSignedUrl(@Body() dto: GetSignedUrlDTO) {
    const data = getSignedUrlDTOSchema.parse(dto);
    const result = await this.uploadService.getSignedUrl(
      data.fileName,
      data.mimeType,
    );
    return { data: result };
  }
}

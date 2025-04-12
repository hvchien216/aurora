import { Inject, Injectable } from '@nestjs/common';
import { CLOUD_STORAGE } from 'src/share/share.di-tokens';
import { FileMetadata, IStorageProvider } from 'src/share/interface';
import { File, IUploadService } from './upload.port';
import { ErrFileRequired, ErrUploadFailed } from './upload.model';
import { AppError } from 'src/share';

@Injectable()
export class UploadService implements IUploadService {
  constructor(
    @Inject(CLOUD_STORAGE) private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadSingle(file: File): Promise<FileMetadata> {
    if (!file) {
      throw AppError.from(ErrFileRequired, 400);
    }

    try {
      return await this.storageProvider.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
    } catch (error) {
      throw AppError.from(ErrUploadFailed, 400).withLog(error.message);
    }
  }

  async uploadMultiple(files: File[]): Promise<FileMetadata[]> {
    if (!files || files.length === 0) {
      throw AppError.from(ErrFileRequired, 400);
    }

    const uploadPromises = files.map((file) =>
      this.storageProvider.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw AppError.from(ErrUploadFailed, 400).withLog(error.message);
    }
  }

  async getSignedUrl(
    fileName: string,
    mimeType: string,
  ): Promise<{ url: string; key: string }> {
    try {
      return await this.storageProvider.getSignedUploadUrl(fileName, mimeType);
    } catch (error) {
      throw AppError.from(ErrUploadFailed, 400).withLog(error.message);
    }
  }
}

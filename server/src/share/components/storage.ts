import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  CloudStorageConfig,
  StorageProvider,
} from 'src/share/config/config.interface';
import {
  FileMetadata,
  IStorageProvider,
  SignedUrlResponse,
} from 'src/share/interface';

// Error definitions
export const ErrFileUploadFailed = new Error('File upload failed');
export const ErrInvalidFileType = new Error('Invalid file type');
export const ErrFileTooLarge = new Error('File too large');
export const ErrFileNotFound = new Error('File not found');

@Injectable()
export class StorageService implements IStorageProvider {
  private readonly s3Client: S3Client;
  private readonly config: CloudStorageConfig;

  constructor(private readonly configService: ConfigService) {
    const storageConfig = this.configService.get<CloudStorageConfig>('storage');

    if (!storageConfig) {
      throw new Error('Storage configuration is missing');
    }
    this.config = storageConfig;
    // Initialize S3 client based on provider
    if (this.config.provider === StorageProvider.R2) {
      this.s3Client = new S3Client({
        region: this.config.region,
        endpoint: this.config.endpoint,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });
    } else {
      // Default to AWS S3
      this.s3Client = new S3Client({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });
    }
  }

  /**
   * Generate a unique file key based on original filename and timestamp
   */
  private generateKey(fileName: string, prefix: string = ''): string {
    const timestamp = new Date().getTime();
    // Simple hash function using timestamp and filename
    const hashInput = `${fileName}_${timestamp}`;
    let hashValue = 0;

    // Simple string hashing algorithm
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hashValue = (hashValue << 5) - hashValue + char;
      hashValue = hashValue & hashValue; // Convert to 32bit integer
    }

    // Convert to hex-like string and take first 8 characters
    const hash = Math.abs(hashValue).toString(16).substring(0, 8);
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');

    return `${prefix}${hash}_${cleanFileName}`;
  }

  /**
   * Validate file before upload
   */
  private validateFile(mimeType: string, sizeInBytes: number): void {
    if (!this.config.allowedMimeTypes.includes(mimeType)) {
      throw ErrInvalidFileType;
    }

    if (sizeInBytes > this.config.maxSizeInBytes) {
      throw ErrFileTooLarge;
    }
  }

  /**
   * Upload a file directly to storage
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    prefix: string = 'uploads/',
  ): Promise<FileMetadata> {
    this.validateFile(mimeType, fileBuffer.length);

    const key = this.generateKey(fileName, prefix);

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        }),
      );

      const url = this.getPublicUrl(key);

      return {
        key,
        fileName,
        mimeType,
        sizeInBytes: fileBuffer.length,
        url,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw ErrFileUploadFailed;
    }
  }

  /**
   * Generate a signed URL for client-side upload
   */
  async getSignedUploadUrl(
    fileName: string,
    mimeType: string,
    prefix: string = 'uploads/',
    expiresInSeconds: number = 3600,
  ): Promise<SignedUrlResponse> {
    this.validateFile(mimeType, 0); // Only validate mime type

    const key = this.generateKey(fileName, prefix);

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: mimeType,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      url: signedUrl,
      key,
    };
  }

  /**
   * Generate a signed URL for viewing/downloading a file
   */
  async getSignedDownloadUrl(
    key: string,
    expiresInSeconds: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  /**
   * Get a public URL for a file (if the bucket allows public access)
   */
  getPublicUrl(key: string): string {
    if (this.config.provider === StorageProvider.R2) {
      // For R2, construct the URL based on the endpoint
      const endpoint = this.config.endpoint?.replace(/https?:\/\//, '');
      return `https://${this.config.bucket}.${endpoint}/${key}`;
    }

    // For S3
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      console.error('Delete failed:', error);
      throw ErrFileNotFound;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT ?? 'https://storage.yandexcloud.net',
    region: process.env.S3_REGION ?? 'ru-central1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? '',
      secretAccessKey: process.env.S3_SECRET_KEY ?? '',
    },
    forcePathStyle: false,
    // Yandex S3 does not support AWS SDK v3 automatic checksums — disable them
    requestChecksumCalculation: 'WHEN_REQUIRED' as any,
    responseChecksumValidation: 'WHEN_REQUIRED' as any,
  });

  private get bucket(): string {
    return process.env.S3_BUCKET ?? '';
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read' as any,
      }),
    );

    const endpoint = process.env.S3_ENDPOINT ?? 'https://storage.yandexcloud.net';
    const url = `${endpoint}/${this.bucket}/${key}`;
    this.logger.log(`Uploaded file → ${url}`);
    return url;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    this.logger.log(`Deleted file: ${key}`);
  }
}

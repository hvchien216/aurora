import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import type { AppConfig, CorsConfig } from 'src/share/config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const corsConfig = configService.get<CorsConfig>('cors');
  app.setGlobalPrefix('v1');
  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(appConfig.port || 3000);
}
bootstrap();

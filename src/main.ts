import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());

  // config Reflector 
  const reflector = app.get(Reflector);

  // setup AuthGuard global
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // config interceptors 
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // setup config CORS
  app.enableCors(
    {
      "origin": "http://localhost:3000/",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
    }
  );

  //config versioning url
  app.setGlobalPrefix('api') // Tiền tố sẽ là "api"
  app.enableVersioning({
    type: VersioningType.URI, // mặc định của VersioningType.URI là '/v'
    defaultVersion: ['1', '2'], // => v1,v2
  });

  await app.listen(configService.get<string>('PORT'));
  console.log("App is listening on: ", configService.get<string>('PORT'));
}
bootstrap();

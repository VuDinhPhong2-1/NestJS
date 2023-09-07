import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],  // Thêm ConfigModule vào đây
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),// Cấu hình toàn cục, truy cập từ bất kỳ module nào trong ứng dụng mà không cần phải import lại ConfigModule
    UsersModule, AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,

    },
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard,
    },
  ],
})
export class AppModule { }

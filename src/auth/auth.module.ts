import { Module } from '@nestjs/common';
import { AuthService } from './auth.service'; // Module dịch vụ xác thực và quản lý người dùng trong ứng dụng
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy'; // Chiến lược xác thực cục bộ
import { PassportModule } from '@nestjs/passport'; // Mô-đun hỗ trợ xác thực và xác autorization
import { JwtModule } from '@nestjs/jwt'; // Thư viện hỗ trợ xác thực và quản lý JSON Web Tokens (JWT) trong NestJS
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // Chiến lược xác minh và giải mã JWT trong ứng dụng
@Module({
  imports: [
    UsersModule,
    PassportModule,
    // Cấu hình configModule và configService cho JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], //LocalStrategy sẽ được hệ thống biết khi tạo AuthModule
})
export class AuthModule {

}

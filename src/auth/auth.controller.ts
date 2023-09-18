import { Controller, Get, Post, Render, UseGuards, Body, Res, Req } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Public()
    @UseGuards(LocalAuthGuard) // Deco này sẽ tự đọc biến req.body để xác thực
    @Post("/login")
    handleLogin(@Req() req: any, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user,response);
    }


    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Public()
    @Post('/register')
    @ResponseMessage('Register a new user')
    registerUser(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.RegisterUser(registerUserDto);
    }
}

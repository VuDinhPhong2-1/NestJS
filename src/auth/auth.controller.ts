import { Controller, Get, Post, Render, UseGuards, Body, Res, Req } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private readonly rolesService: RolesService) { }
    @Public()
    @UseGuards(LocalAuthGuard) // Deco này sẽ tự đọc biến req.body để xác thực
    @ApiBody({ type: UserLoginDto })
    @Post("/login")
    handleLogin(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(user, response);
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

    @Get('/account')
    @ResponseMessage('Get infomation account')
    async handleGetAccount(@User() user: IUser) {
        return user;
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage('refresh token')
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response)
    }

    @Get('/logout')
    @ResponseMessage('Logout account')
    handleLogout(
        @User() user: IUser,
        @Res({ passthrough: true }) response: Response
    ) {
        this.authService.deleteCookieAndToken(user._id.toString(), response);
    }
}

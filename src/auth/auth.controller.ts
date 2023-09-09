import { Controller, Get, Post, Render, UseGuards, Request } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorators/customize';


@Controller('auth')
export class AuthController {
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    handleLogin(@Request() req) {
        return req.user;
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}

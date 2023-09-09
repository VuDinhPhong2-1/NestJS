import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (typeof user === 'string') {
            // Xử lý trường hợp lỗi ở đây, ví dụ: throw một lỗi xác thực
            return error("Tên đăng nhập không hợp lệ!");
        }
        const isPassword = await this.usersService.isValidPassword(pass, user.password)
        if (isPassword) {
            const access_token = await this.login(user);
            return access_token;
        } else {
            return error("Mật khẩu và Tên người dùng không đúng!!!")
        }
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };
    }
}

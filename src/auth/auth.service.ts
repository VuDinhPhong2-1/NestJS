import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (typeof user === 'string') {
            // Xử lý trường hợp lỗi ở đây, ví dụ: throw một lỗi xác thực
            return error("Tên đăng nhập không hợp lệ!");
        }
        const isPassword = await this.usersService.isValidPassword(pass, user.password)
        if (isPassword) {
            return user;
        } else {
            return error("Mật khẩu và Tên người dùng không đúng!!!")
        }
    }
}

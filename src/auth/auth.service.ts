import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { throwError } from 'rxjs';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name)
        private UserModel: SoftDeleteModel<UserDocument>
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
    async RegisterUser(registerUserDto: RegisterUserDto) {
        const emailExists = await this.UserModel.findOne({ email: registerUserDto.email });
        if (emailExists) {
            throw new ConflictException('Email đã tồn tại!!!');
        }
        const roleUser = 'USER';
        const pass = await this.usersService.hashPassword(registerUserDto.password)
        console.log(registerUserDto)
        const result = await this.UserModel.create(
            {
                ...registerUserDto,
                role: roleUser,
                password: pass
            });
        return result;
    }
}

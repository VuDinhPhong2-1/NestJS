import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
    @IsString({message: 'Phải là 1 chuỗi ký tự!'})
    @IsNotEmpty({message: 'Không được để trống!'})
    @IsEmail({},{message: 'Không đúng định dạng email!'})
    email: string

    @IsNotEmpty()
    password: string

    name: string

    phone: string
}

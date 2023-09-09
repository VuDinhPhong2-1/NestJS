import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateCompanyDto {
    // @IsString({message: 'Phải là 1 chuỗi ký tự!'})
    // @IsNotEmpty({message: 'Không được để trống!'})
    // @IsEmail({},{message: 'Không đúng định dạng email!'})
    @IsNotEmpty({ message: 'Name được để trống!' })
    name: string

    @IsNotEmpty({ message: 'Address được để trống!' })
    address: string

    @IsNotEmpty({ message: 'Description được để trống!' })
    description: string
}

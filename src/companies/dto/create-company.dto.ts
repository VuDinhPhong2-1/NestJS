import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name được để trống!' })
    name: string

    @IsNotEmpty({ message: 'Address được để trống!' })
    address: string

    @IsNotEmpty({ message: 'Description được để trống!' })
    description: string
}

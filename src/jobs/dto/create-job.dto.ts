import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Skills không được để trống!' })
    @IsArray({ message: 'Skills phải là một mảng!' })
    @IsString({ each: true, message: 'Mỗi phần tử trong mảng skills phải là một chuỗi!' })
    skills: string[]

    // @IsNotEmpty({ message: 'Address được để trống!' })
    // address: string

    // @IsNotEmpty({ message: 'location được để trống!' })
    // location: string

    @IsNotEmpty({ message: 'startDate không được để trống!' })
    @IsDateString()
    startDate: Date

    @IsNotEmpty({ message: 'endDate không được để trống!' })
    @IsDateString()
    endDate: Date

    // @IsNotEmpty({ message: 'logo không được để trống!' })
    // logo: string


    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

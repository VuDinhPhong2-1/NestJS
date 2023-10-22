import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsNotEmpty()
    @IsArray()
    skills: string[];
}

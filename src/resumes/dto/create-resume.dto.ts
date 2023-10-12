import { IsMongoId, IsNotEmpty, isMongoId } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {

    @IsNotEmpty({message: 'email Không được để trống'})
    email: string;
    
    @IsNotEmpty({message: 'userId Không được để trống'})
    userId: string;
    
    @IsNotEmpty({message: 'url Không được để trống'})
    url: string;

    @IsNotEmpty({message: 'status Không được để trống'})
    status: string;

    @IsNotEmpty({message: 'companyId Không được để trống'})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'jobId Không được để trống'})
    jobId: mongoose.Schema.Types.ObjectId;
}

export class createUserCvDto{
    @IsNotEmpty({message: 'url Không được để trống'})
    url: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'companyId Không được để trống'})
    @IsMongoId({message: 'companyId Không phải id hợp lệ'})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'jobId Không được để trống'})
    @IsMongoId({message: 'jobId Không phải id hợp lệ'})
    jobId: mongoose.Schema.Types.ObjectId;
}
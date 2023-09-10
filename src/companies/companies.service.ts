import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name)
    private UserModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const result = await this.UserModel.create(
      {
        createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return result;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}

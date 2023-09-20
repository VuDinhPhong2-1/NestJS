import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name)
    private CompanyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    console.log(createCompanyDto)
    const result = await this.CompanyModel.create(
      {
        ...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return result;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.CompanyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.CompanyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();
    return {
      message: "Lấy thành công",
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const result = await this.CompanyModel.findByIdAndUpdate(id,
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return result;
  }

  async remove(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const result = await this.CompanyModel.findByIdAndUpdate(id,
      {
        ...updateCompanyDto,
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.CompanyModel.softDelete({ _id: id });
  }
}

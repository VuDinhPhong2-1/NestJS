import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateResumeDto, createUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {

  constructor(
    @InjectModel(Resume.name)
    private ResumeModel: SoftDeleteModel<ResumeDocument>) { }

  create(createUserCvDto: createUserCvDto, user: IUser) {
    const newResume = this.ResumeModel.create({
      ...createUserCvDto,
      userId: user._id,
      status: "PENDING",
      history: [
        {
          status: "PENDING",
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newResume;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.ResumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.ResumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findByUsers(user: IUser) {
    return await this.ResumeModel.find({
      userId: user._id,
    })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 }
        },
        {
          path: "jobId",
          select: { name: 1 }
        }
      ])
  }

  findOne(id: string) {
    if (!mongoose.Schema.Types.ObjectId) {
      return new BadRequestException('Id khong hop le!')
    }
    const result = this.ResumeModel.findById(id);
    return result;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  async remove(id: string, user: IUser, updateResumeDto: UpdateResumeDto) {
    await this.ResumeModel.findByIdAndUpdate(id, {
      ...updateResumeDto,
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.ResumeModel.softDelete({ _id: id })
  }
}

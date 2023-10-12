import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { error } from 'console';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/soft-delete-model';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: SoftDeleteModel<UserDocument>) { }

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = new this.UserModel(createUserDto);
      newUser.password = this.hashPassword(createUserDto.password); // Mã hóa mật khẩu trước khi lưu
      await this.UserModel.create(newUser); // Lưu đối tượng vào cơ sở dữ liệu
      return newUser;
    } catch (error) {
      console.log(error)
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.UserModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('Id không hợp lệ!');
    }
    const user = await this.UserModel.findOne({ _id: id }).select('-password')
      .populate({
        path: 'role',
        select: { name: 1, _id: 1 }
      })
      .exec();
    if (!user) {
      throw new NotFoundException('Không tồn tại người dùng!');
    }
    return user;
  }
  async findOneByEmail(email: string) {
    try {
      if (email === null || email === '' || email === undefined) return "Không được để trống email người dùng!";
      const user = await this.UserModel.findOne({ email: email })
        .populate({
          path: 'role',
          select: { name: 1, permisstion: 1 }
        });
      if (!user) return "Không tìm thấy người dùng!"
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  async isValidPassword(password, hash) {
    const result = compareSync(password, hash);
    return result;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userUpdate = await this.UserModel.findOneAndUpdate({ _id: id }, updateUserDto);
      if (!userUpdate) return 'Lỗi không thể cập nhật!'
      return userUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Có lỗi xảy ra trong quá trình xử lý yêu cầu.');
    }
  }

  async remove(id: string, user: IUser) {
    this.UserModel.softDelete({ _id: id });
    const result = await this.UserModel.findByIdAndUpdate(
      {
        _id: id,
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return result;
  }

  async updateUserToken(refresh_token: string, _id: string) {
    return this.UserModel.updateOne(
      { _id },
      {
        refresh_token: refresh_token
      });
  }

  async findOneByRefreshToken(refresh_token: string) {
    return this.UserModel.findOne({ refresh_token: refresh_token });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { error } from 'console';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/soft-delete-model';
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return "Id không hợp lệ!";
      }
      const user = this.UserModel.findOne({ _id: id })
      console.log("user", user)
      if (!user) return "Không tồn tại người dùng!"
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  async findOneByEmail(email: string) {
    try {
      if (email === null || email === '' || email === undefined) return "Không được để trống email người dùng!";
      const user = await this.UserModel.findOne({ email: email });
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
      console.log(error)
    }
  }

  remove(id: string) {
    return this.UserModel.softDelete({ _id: id });
  }
}

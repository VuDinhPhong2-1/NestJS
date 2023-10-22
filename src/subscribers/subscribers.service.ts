import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name)
  private subscriberModel: SoftDeleteModel<SubscriberDocument>) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const isExist = await this.subscriberModel.exists({ email: createSubscriberDto.email });
    if (isExist) {
      throw new BadRequestException("Email đã được đăng ký từ trước");
    }
    const result = await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: user._id,
    });
    return result;
  }

  findAll() {
    return `This action returns all subscribers`;
  }

  findOne(id: string) {
    return `This action returns a #${id} subscriber`;
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const result = await this.subscriberModel.findByIdAndUpdate(id,
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return result;
  }

  async remove(id: string, user: IUser) {
    const result = await this.subscriberModel.softDelete({ _id: id });
    await this.subscriberModel.findByIdAndUpdate(id,
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return result;
  }
}

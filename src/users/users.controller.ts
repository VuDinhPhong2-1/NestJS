import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Public()
  @Post()
  @ResponseMessage('Create a new User')
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      console.log(error);
    }
  }
  @Public()
  @Get()
  findAll(
    @Query('page') curentPage: string,
    @Query('limit') limit: string,
    @Query() qs
  ) {
    return this.usersService.findAll(+curentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove a User')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id,user);
  }
}

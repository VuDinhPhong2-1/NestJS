import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, createUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }


  @Post()
  create(@Body() createUserCvDto: createUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch all resume pagination")
  findAll(@Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs) {
    return this.resumesService.findAll(+current, +pageSize, qs);
  }
  @Get('by-user')
  @ResponseMessage("Fetch a resume")
  findByUserId(@User() user: IUser) {
    return this.resumesService.findByUsers(user);
  }
  @Public()
  @Get(':id')
  @ResponseMessage("Fetch a resume")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumesService.update(+id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser, updateResumeDto: UpdateResumeDto) {
    return this.resumesService.remove(id, user, updateResumeDto);
  }
}

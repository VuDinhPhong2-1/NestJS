import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import mongoose from 'mongoose';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) { }

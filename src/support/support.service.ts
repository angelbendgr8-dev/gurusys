import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Support, SupportDocument } from './schema/support.schema';
import { Model } from 'mongoose';
import { formatedResponse } from 'src/utils/helpers';
import { PaginatorService } from 'src/paginator/paginator.service';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name)
    private supportRepository: Model<SupportDocument>,
    private paginator: PaginatorService,
  ){}
  async create(createSupportDto: CreateSupportDto,user) {
    const support = await this.supportRepository.create({user: user._id,...createSupportDto});
    return formatedResponse(
      'New support ticket created successfully',
      200,
      'success',
      support,
    );
  }

  async findAll(query, user) {
    const supports =  this.supportRepository.find({ user: user._id });

    const { data, meta } = await this.paginator.paginateData(
      { page: query.page, perPage: query.perPage },
      supports,
      this.supportRepository,
    );
    return formatedResponse(
      'Supports  fetched successfully',
      200,
      'success',
      {
        tickets: data,
        meta,
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} support`;
  }

  update(id: number, updateSupportDto: UpdateSupportDto) {
    return `This action updates a #${id} support`;
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}

import { Injectable } from '@nestjs/common';
import { Model, Document, Query } from 'mongoose';
import { PaginatorParams } from './interfaces/paginator.interface';

@Injectable()
export class PaginatorService {
  async paginateData<T extends Document>(
    params: PaginatorParams,
    query: Query<any, T>,
    model: Model<T>,
    baseQuery?:any,
  ) {
    const perPage = Number(params.perPage ?? 25);

    const currentPage = Number(params.page ?? 1);

    const skip = Math.max(currentPage - 1, 0) * perPage;
    // console.log(skip, '------skip-------');

    // const totalDocuments = await model.count(query);
    const totalDocuments = await model.countDocuments(baseQuery);
    const totalPages = Math.ceil(totalDocuments / perPage);
    const data = await query.skip(skip).limit(perPage).exec();

    const lastPage =
      totalDocuments < perPage ? 1 : Math.ceil(totalDocuments / perPage);
    const from = data.length ? (currentPage - 1) * perPage + 1 : 0;
    const to = data.length ? from + data.length - 1 : 0;

    return {
      data,
      meta: {
        currentPage,
        perPage,
        totalPages,
        totalDocuments,
        lastPage,
        from,
        to,
      },
    };
  }
}

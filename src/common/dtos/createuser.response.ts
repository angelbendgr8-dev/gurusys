import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { GeneralResponse } from './otpgen.response';
import { PageDto } from './page.dto';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  postalAddress: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  password: string;

  @ApiProperty()
  profilePics: string;

  @ApiProperty()
  isVerified: boolean;
}

export class googleResponseObject {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePics: string;
}

export class CreateResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  token: string;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  perPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalDocuments: number;
  @ApiProperty()
  lastPage: number;
  @ApiProperty()
  from: number;
  @ApiProperty()
  to: number;

  data: TData[];
}
export class BankPaginatedDto<TData> {
  @ApiProperty()
  next: string;
  @ApiProperty()
  perPage: number;
  @ApiProperty()
  previous: string;
  @ApiProperty()
  data: TData[];
}
export const ApiGeneralResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GeneralResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
export const ApiGeneralArrayResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GeneralResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
export const ApiGeneralCreatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GeneralResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
export const ApiBankPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(BankPaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

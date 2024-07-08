import { applyDecorators, Type } from "@nestjs/common";
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";


export class OTPResponse {
    @ApiProperty()
    otp_hash: string;
}
export class OTPVerifiedResponse {
    @ApiProperty()
    verified: string;
}
export class GeneralResponse<TData> {
    @ApiProperty()
    message: string;
    @ApiProperty()
    code: number;
    @ApiProperty()
    status: string;

    data: TData;
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
export const ApiGeneralArrayResponse = <TModel extends Type<any>>(model: TModel) => {
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
                            }
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
                    { $ref: getSchemaPath(PaginatedDto) },
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
  
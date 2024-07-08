import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSupportDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    reason: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

}

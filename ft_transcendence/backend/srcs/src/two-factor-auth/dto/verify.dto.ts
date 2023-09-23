import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;
}
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  login: string;
}
export class FirstNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstname: string;
}
export class LastNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastname: string;
}

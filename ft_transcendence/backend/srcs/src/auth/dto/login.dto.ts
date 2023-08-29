import { IsString, IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsString()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

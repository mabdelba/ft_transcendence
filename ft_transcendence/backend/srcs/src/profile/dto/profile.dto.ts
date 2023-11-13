import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userLogin : string
}
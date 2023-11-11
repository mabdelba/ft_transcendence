import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ReceiverIdDto{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    recieverId: number
}

export class SenderIdDto{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    senderId: number
}

export class FriendIdDto{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    friendId: number
}

export class UserIdDto{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number
}
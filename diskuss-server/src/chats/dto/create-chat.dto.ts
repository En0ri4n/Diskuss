import { IsArray, IsString } from 'class-validator';

export class CreateChatDto {
    @IsArray()
    participants: string[];

    @IsString()
    name: string;
}

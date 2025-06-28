import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
    @IsArray()
    participants: string[];

    @IsOptional()
    @IsString()
    name?: string;
}

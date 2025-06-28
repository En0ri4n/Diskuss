import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttachmentDto {
    @IsString()
    type: string;

    @IsString()
    url: string;
}

export class CreateMessageDto {
    @IsString()
    chatId: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttachmentDto)
    attachments?: AttachmentDto[];
}

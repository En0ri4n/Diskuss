import { IsMongoId, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateNotificationDto {
    @IsMongoId()
    recipient: string;

    @IsString()
    message: string;

    @IsOptional()
    @IsIn(['message', 'mention', 'system'])
    type?: 'message' | 'mention' | 'system';
}

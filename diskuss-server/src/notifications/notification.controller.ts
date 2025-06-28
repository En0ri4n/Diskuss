import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Delete,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    async create(@Body() dto: CreateNotificationDto) {
        return this.notificationService.create(dto);
    }

    @Get()
    async getMyNotifications(@Req() req: Request) {
        // @ts-ignore
        const userId = req.user['userId'];
        return this.notificationService.findForUser(userId);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return this.notificationService.markAsRead(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.notificationService.delete(id);
        return { message: 'Notification deleted successfully' };
    }
}

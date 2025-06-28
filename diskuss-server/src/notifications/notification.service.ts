import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) {}

    async create(dto: CreateNotificationDto): Promise<Notification> {
        return this.notificationModel.create({
            recipient: new Types.ObjectId(dto.recipient),
            message: dto.message,
            type: dto.type || 'message',
        });
    }

    async findForUser(userId: string): Promise<Notification[]> {
        return this.notificationModel
            .find({ recipient: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 });
    }

    async markAsRead(id: string): Promise<Notification> {
        const notification = await this.notificationModel.findById(id);
        if (!notification) throw new NotFoundException('Notification not found');
        notification.read = true;
        return notification.save();
    }

    async delete(id: string): Promise<void> {
        await this.notificationModel.findByIdAndDelete(id);
    }
}

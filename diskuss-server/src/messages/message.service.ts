import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

    async create(createDto: CreateMessageDto, senderId: string): Promise<Message> {
        const message = await this.messageModel.create({
            chatId: new Types.ObjectId(createDto.chatId),
            senderId: new Types.ObjectId(senderId),
            text: createDto.text,
            attachments: createDto.attachments || [],
        });
        return message;
    }

    async findByChat(chatId: string): Promise<Message[]> {
        return this.messageModel
            .find({ chatId: new Types.ObjectId(chatId) })
            .sort({ createdAt: 1 })
            .populate('senderId', 'username email');
    }

    async findById(id: string): Promise<Message> {
        const message = await this.messageModel.findById(id).populate('senderId', 'username email');
        if (!message) throw new NotFoundException('Message not found');
        return message;
    }

    async delete(id: string, userId: string): Promise<void> {
        const message = await this.messageModel.findById(id);
        if (!message) throw new NotFoundException('Message not found');
        if (message.senderId.toString() !== userId) {
            throw new ForbiddenException('You can only delete your own messages');
        }
        await this.messageModel.findByIdAndDelete(id);
    }
}

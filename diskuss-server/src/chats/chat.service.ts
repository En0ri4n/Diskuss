import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import {Message} from "../messages/message.schema";

@Injectable()
export class ChatService {
    mainChatName: string = 'Home Chat'; // Default chat name

    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>,
                @InjectModel(Message.name) private messageModel: Model<Message>
    ) {}

    async saveMessage(message: Partial<Message>): Promise<Message> {
        if (!message.chatId) {
            throw new NotFoundException('Chat ID is required');
        }
        const defaultChatExists = await this.chatModel.exists({ name: this.mainChatName });
        if (!defaultChatExists) {
            // Create default chats if it doesn't exist
            const chat = await this.chatModel.create({
                participants: [],
                name: this.mainChatName,
            });

            message.chatId = chat._id;
        }

        if (message.chatId == 'default') {
            const defaultChat = await this.chatModel.findOne({ name: this.mainChatName });
            if (defaultChat) {
                message.chatId = defaultChat._id;
            } else {
                throw new NotFoundException('Default chat not found');
            }
        }

        const chatExists = await this.chatModel.exists({ _id: message.chatId });
        if (!chatExists) {
            throw new NotFoundException('Chat not found');
        }

        const msg = new this.messageModel(message);
        return msg.save();
    }

    async create(dto: CreateChatDto): Promise<Chat> {
        return this.chatModel.create({
            participants: dto.participants.map((id) => new Types.ObjectId(id)),
            name: dto.name,
        });
    }

    async findAllByUser(userId: string): Promise<Chat[]> {
        return this.chatModel
            .find({ participants: userId })
            .populate('participants', 'username email');
    }

    async findById(id: string): Promise<Chat> {
        const chat = await this.chatModel
            .findById(id)
            .populate('participants', 'username email');
        if (!chat) throw new NotFoundException('Chat not found');
        return chat;
    }

    async delete(id: string): Promise<void> {
        await this.chatModel.findByIdAndDelete(id);
    }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {ChatGateway} from "./chat.gateway";
import {Message, MessageSchema} from "../messages/message.schema";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ],
    providers: [ChatService, ChatGateway],
    controllers: [ChatController],
    exports: [ChatService],
})
export class ChatModule {}

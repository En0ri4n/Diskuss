import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {User, UserSchema} from "./users/user.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {Message, MessageSchema} from "./messages/message.schema";
import {Chat, ChatSchema} from "./chats/chat.schema";
import {Notification, NotificationSchema} from "./notifications/notification.schema";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./users/user.module";
import {ChatModule} from "./chats/chat.module";
import {MessageModule} from "./messages/message.module";
import {NotificationModule} from "./notifications/notification.module";

@Module({
  imports: [
      AuthModule,
      UserModule,
      ChatModule,
      MessageModule,
      NotificationModule,
      ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRoot('mongodb://home.enorian.dev/diskuss-db'),
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Message.name, schema: MessageSchema },
        { name: Chat.name, schema: ChatSchema },
        { name: Notification.name, schema: NotificationSchema },
      ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

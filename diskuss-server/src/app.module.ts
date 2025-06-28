import {Module, OnModuleInit} from '@nestjs/common';
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
import {TestService} from "./test/test.service";

@Module({
  imports: [
      AuthModule,
      UserModule,
      ChatModule,
      MessageModule,
      NotificationModule,
      ConfigModule.forRoot({ isGlobal: true,
          envFilePath: '.env',
      }),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
              uri: `mongodb://${config.get('MONGODB_USERNAME')}:${encodeURIComponent(<string>config.get('MONGODB_PASSWORD'))}@${config.get('MONGODB_HOST')}:${config.get('MONGODB_PORT')}?retryWrites=true&w=majority`
          }),
          inject: [ConfigService],
      }),
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Message.name, schema: MessageSchema },
        { name: Chat.name, schema: ChatSchema },
        { name: Notification.name, schema: NotificationSchema },
      ]),
  ],
  controllers: [AppController],
  providers: [AppService, TestService],
})
export class AppModule implements OnModuleInit {
    constructor(private testService: TestService) {}

    onModuleInit() {
        const env = process.env.NODE_ENV || 'development';
        console.log(`AppModule initialized in ${env} mode.`);

        // this.testService.testSecretKey();
    }
}

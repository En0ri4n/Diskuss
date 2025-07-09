import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatGateway } from '../../services/chats/chat.gateway';
import {FormsModule} from '@angular/forms';
import {formatDate, NgForOf} from '@angular/common';
import {ChatMessageComponent} from '../chat-message/chat-message.component';
import {IncomingMessageDto} from '../../services/messages/dto/message.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    NgForOf,
    ChatMessageComponent
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: IncomingMessageDto[] = [];
  message: string = '';

  constructor(private chatService: ChatGateway) {}

  ngOnInit() {
    this.chatService.onNewMessage((msg: IncomingMessageDto) => {
      console.log(msg)
      this.messages.push(msg);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage({
        chatId: 'default',
        text: this.message,
        senderId: '67890'
      });
      this.message = '';
    }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  protected readonly formatDate = formatDate;
}

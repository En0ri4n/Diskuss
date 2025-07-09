import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatGateway } from '../../services/chats/chat.gateway';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MessageDto} from '../../services/messages/dto/message.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  message: string = '';

  constructor(private chatService: ChatGateway) {}

  ngOnInit() {
    this.chatService.onNewMessage((msg: MessageDto) => {
      console.log(msg)
      this.messages.push(`${msg.senderId}: ${msg.text}`);
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
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatGateway } from '../../services/chats/chat.gateway';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

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
    this.chatService.onNewMessage((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      // Remplacez les valeurs par les vraies données de votre app
      this.chatService.sendMessage({
        chatId: '12345',
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

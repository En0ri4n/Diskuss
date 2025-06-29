import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ChatComponent} from '../../components/chat/chat.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  imports: [
    ChatComponent
  ],
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {
  chatId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.chatId = this.route.snapshot.paramMap.get('id');

    if (!this.chatId) {
      console.error('Chat ID is not provided in the route parameters.');
    } else {
      console.log('Chat ID:', this.chatId);
      // Here you can initialize your chat service with the chatId
      // For example: this.chatService.initializeChat(this.chatId);
    }
  }
}

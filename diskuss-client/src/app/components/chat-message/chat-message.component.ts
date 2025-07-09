import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [
    NgClass
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() fromSelf: boolean = false;
  @Input() avatarUrl: string = '/default-user.png';
  @Input() username: string = 'User';
  @Input() createdAt: string = '10/02/2004 15:30';
  @Input() message: string = 'Hello, how are you?';
}

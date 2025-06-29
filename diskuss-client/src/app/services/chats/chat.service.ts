
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from '../../config';
import {CreateChatDto} from './dto/create-chat.dto';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private API_URL = config.apiUrl + '/chats';
  constructor(private http: HttpClient,
              private router: Router) {
    // Ensure the API URL is set correctly
    if (!this.API_URL) {
      console.error('API URL is not set. Please check your configuration.');
    }
  }

  async createChat(participants: string[], name: string): Promise<CreateChatDto> {
    return firstValueFrom(this.http.post<CreateChatDto>(`${this.API_URL}/create`, {participants, name}));
  }

  async createChatAndRedirect(participants: string[], name: string): Promise<void> {
    const chat = await this.createChat(participants, name);
    if (chat) {
      // Assuming you have a method to redirect to the chat page
      this.router.navigate(['/chat', chat._id]);
      console.log('Chat created and redirecting to chat page:', chat);
    } else {
      console.error('Failed to create chat');
    }
  }
}

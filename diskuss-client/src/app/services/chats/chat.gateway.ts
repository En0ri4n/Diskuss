import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {MessageDto} from '../messages/dto/message.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatGateway {
  private socket: Socket;
  readonly uri: string = 'ws://localhost:3000'; // replace with environment/config

  constructor() {
    const token = localStorage.getItem('token');

    this.socket = io(this.uri, {
      auth: {
        token: token,
      },
    });
  }

  sendMessage(message: MessageDto) {
    this.socket.emit('sendMessage', message);
  }

  onNewMessage(callback: (msg: MessageDto) => void) {
    this.socket.on('newMessage', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private socket: Socket;
  readonly uri: string = 'ws://localhost:3000'; // replace with environment/config

  constructor() {
    const token = localStorage.getItem('token'); // or use another secure method

    this.socket = io(this.uri, {
      auth: {
        token: token,
      },
    });
  }

  sendMessage(message: { chatId: string; text: string }) {
    this.socket.emit('sendMessage', message);
  }

  onNewMessage(callback: (msg: any) => void) {
    this.socket.on('newMessage', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

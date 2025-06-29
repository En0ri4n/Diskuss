import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import {Message} from "../messages/message.schema";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
    ) {}

    server: Server;

    afterInit(server: Server) {
        console.log('WebSocket initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
            if (!token) throw new UnauthorizedException('No token provided');

            const decoded = this.jwtService.verify(token);
            client.data.user = decoded; // attach users to socket
            console.log(`Client connected: ${client.id} (user: ${decoded.email})`);
        } catch (err) {
            console.log('WebSocket auth failed:', err.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    getUserFromSocket(client: Socket): void {
        const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        const decoded = this.jwtService.verify(token);
        if (!decoded || !decoded.sub) {
            throw new UnauthorizedException('Invalid token');
        }
        client.data.user = decoded; // attach users to socket
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody()
        message: { chatId: string; text: string },
        @ConnectedSocket() client: Socket,
    ) {
        const senderId = client.data.user?.sub;
        if (!senderId) return;

        await this.getUserFromSocket(client);

        const savedMessage: Message = await this.chatService.saveMessage({
            chatId: message.chatId,
            text: message.text,
            senderId: client.data.user._id
        });

        this.server.emit('newMessage', savedMessage);
    }
}

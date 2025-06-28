import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Req,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateChatDto) {
        return this.chatService.create(dto);
    }

    @Get()
    async getMyChats(@Req() req: Request) {
        // @ts-ignore
        const userId = req.user['userId'];
        return this.chatService.findAllByUser(userId);
    }

    @Get(':id')
    async getChat(@Param('id') id: string) {
        return this.chatService.findById(id);
    }

    @Delete(':id')
    async deleteChat(@Param('id') id: string) {
        await this.chatService.delete(id);
        return { message: 'Chat deleted' };
    }
}

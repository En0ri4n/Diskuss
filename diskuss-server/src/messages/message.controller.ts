import {
    Controller,
    Post,
    Get,
    Param,
    Delete,
    Body,
    UseGuards,
    Req,
    UsePipes,
    ValidationPipe, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
import {FilesInterceptor} from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateMessageDto, @Req() req: Request) {
        // @ts-ignore
        const senderId = req.user['userId'];
        return this.messageService.create(dto, senderId);
    }

    @Get('chat/:chatId')
    async getMessagesByChat(@Param('chatId') chatId: string) {
        return this.messageService.findByChat(chatId);
    }

    @Get(':id')
    async getMessageById(@Param('id') id: string) {
        return this.messageService.findById(id);
    }

    @Delete(':id')
    async deleteMessage(@Param('id') id: string, @Req() req: Request) {
        // @ts-ignore
        const userId = req.user['userId'];
        await this.messageService.delete(id, userId);
        return { message: 'Message deleted successfully' };
    }

    @Post('upload')
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: diskStorage({
                destination: './uploads', // Make sure this folder exists or create it dynamically
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10 MB file size limit
            },
            fileFilter: (req, file, callback) => {
                // Accept images, videos, pdfs, docs, etc. Customize as needed
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'video/mp4',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error('Unsupported file type'), false);
                }
            },
        }),
    )
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        // After upload, return array of objects with type & URL

        // For simplicity, we treat all uploaded files as 'file' type,
        // you can enhance by checking mimetype and returning specific types.
        const uploadedFiles = files.map((file) => ({
            type: file.mimetype.split('/')[0], // e.g. image, video, application
            url: `/uploads/${file.filename}`, // Assuming you serve static files under /uploads
        }));

        return { files: uploadedFiles };
    }
}

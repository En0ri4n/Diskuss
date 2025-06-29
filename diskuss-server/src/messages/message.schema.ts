import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true })
    chatId: unknown;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    senderId: mongoose.Types.ObjectId;

    @Prop()
    text: string;

    @Prop({
        type: [
            {
                type: { type: String },
                url: String,
            },
        ],
        default: [],
    })
    attachments: {
        type: string;
        url: string;
    }[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

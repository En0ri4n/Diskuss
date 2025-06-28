import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: Types.ObjectId;

    @Prop()
    message: string;

    @Prop({ default: false })
    read: boolean;

    @Prop({ type: String, enum: ['message', 'mention', 'system'], default: 'message' })
    type: 'message' | 'mention' | 'system';
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

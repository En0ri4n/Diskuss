import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop()
    profilePicUrl: string;

    @Prop({ default: 'offline' })
    status: string;

    @Prop()
    lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

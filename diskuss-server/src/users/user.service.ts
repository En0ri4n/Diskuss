import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              private jwtService: JwtService
  ) {}

  async create(dto: CreateUserDto): Promise<{ user: {
    _id: unknown;
    username: string;
    email: string;
    profilePicUrl?: string | null;
    }; token: string }> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: dto.email },
        { username: dto.username }
      ]
    });
    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createdUser = new this.userModel({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
      profilePicUrl: dto.profilePicUrl || null,
    });

    const user = await createdUser.save();

    const payload = { userId: user._id, email: user.email, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
      },
      token,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    // @ts-ignore
    return this.userModel.findOne({ email }).exec(); // used for login
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    if (updateData.password) {
      updateData = {
        ...updateData,
        // @ts-ignore
        passwordHash: await bcrypt.hash(updateData.password, 10),
      };
      delete updateData.password;
    }

    const updated = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .select('-passwordHash');

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('User not found');
  }
}

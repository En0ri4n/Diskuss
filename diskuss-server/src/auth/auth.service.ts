import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.passwordHash) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException();

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  register(dto: RegisterDto): Promise<{ user: { _id: unknown; username: string; email: string }; token: string }> {
    return this.userService.create({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      profilePicUrl: 'default-user.png', // Default profile picture URL
    }).then(res => {
      const payload = { sub: res.user._id, email: res.user.email };
      return {
        user: {
          _id: res.user._id,
          email: res.user.email,
          username: res.user.username,
        },
        token: this.jwtService.sign(payload),
      };
    });
  }
}

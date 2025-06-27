import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: {
    email: string;
    password: string;
  }): Promise<string | null> {
    // const user: UserDto = await this.userService.findByEmail(loginDto.email);
    // if (user && (await bcrypt.compare(loginDto.password, user.password))) {
    //   const payload = { sub: user.id, email: user.email };
    //   return this.jwtService.sign(payload);
    // }
    return null;
  }
}

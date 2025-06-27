import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string }
  ): Promise<{ access_token: string }> {
    const token = await this.authService.validateUser(loginDto);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return { access_token: token };
  }
}

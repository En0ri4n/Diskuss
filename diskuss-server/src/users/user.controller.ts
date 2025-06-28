import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getMe(@Req() req: Request): Promise<User> {
        // @ts-ignore
        const userId = req.user['userId'];
        return this.userService.findById(userId);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        await this.userService.delete(id);
        return { message: 'User deleted successfully' };
    }
}

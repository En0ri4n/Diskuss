import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET') || 'secret',
                signOptions: { expiresIn: '1d' }, // Adjust the expiration time as needed
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => UserModule),
    ],
    exports: [JwtModule],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

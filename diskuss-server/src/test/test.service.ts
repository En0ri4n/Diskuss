import { ConfigService } from '@nestjs/config';
import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class TestService {
    constructor(private configService: ConfigService,
                private jwtService: JwtService) {}

    testSecretKey(): void {
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            throw new Error('La clé secrète JWT n\'est pas configurée.');
        }
        console.log('Clé secrète configurée correctement.');
        console.log(`Clé secrète JWT: ${secret}`);

        try {
            const token = this.jwtService.sign({ test: 'payload' });
            console.log(`Token généré : ${token}`);
        } catch (error) {
            throw new Error('La clé secrète JWT n\'est pas configurée ou invalide.');
        }
    }
}
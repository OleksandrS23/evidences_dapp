import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardJWT } from './auth-guard/auth-guard.strategy';
import 'dotenv/config';

@Module({
  imports:[PassportModule.register({ defaultStrategy: 'eth-jwt' }),
  JwtModule.register({
    secret: process.env.AUTH_SECRET,
    signOptions: { expiresIn: '4h' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, AuthGuardJWT]
})
export class AuthModule {}

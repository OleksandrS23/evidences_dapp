import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardJWT extends PassportStrategy(Strategy, 'eth-jwt') {
    constructor(private authService: AuthService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.AUTH_SECRET, 
      });
    }
  
    async validate(username: string, password: string) : Promise<any>
    {
      const user = this.authService.validateUser(username, password)
      
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
  }
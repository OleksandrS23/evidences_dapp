import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string): Promise<any> {
    //const user = await this.usersService.findOneByEmail(email);
    return {username: username, password: password};
    // if (user && user.password === pass) {
    //   return {
    //     id: user._id,
    //     admin: user.userType === 'Admin',
    //     name: user.name,
    //     email: user.email,
    //   };
    // }
    // return null;
  }
}
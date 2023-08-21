import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: any) {
    // Validate credentials, retrieve user, etc.
    const user = await this.authService.validateUser(credentials.user, credentials.password);
    console.log(user)
    if (user) {
      const token = await this.authService.generateToken({ sub: user.id });
      return { token };
    }
  }
}

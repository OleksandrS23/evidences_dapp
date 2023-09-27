import { Controller, Post, Body ,BadRequestException, UnauthorizedException, InternalServerErrorException} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() credentials: any) {
    console.log(credentials)
    if (!credentials.password) {
      throw new BadRequestException('Password is required.');
    }

    try {
      const user = await this.authService.validateUser(
        credentials.address,
        credentials.user,
        credentials.password
      );

      if (user) {
          const token = await this.authService.generateToken({ address: credentials.address , user:  credentials.user});
          return { token };
      }
      
      throw new UnauthorizedException('Invalid credentials.');
    } catch (error) {
      throw new InternalServerErrorException('Authentication failed.');
    }
  }
}


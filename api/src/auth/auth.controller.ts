import { Controller, Post, Body } from '@nestjs/common';
import { EthereumService } from 'src/ethereum/ethereum.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly ethereumService: EthereumService) {}

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

  @Post('getEntities')
  async getEntities(@Body() body: any)
  {
    var result = await this.ethereumService.sendContractTransaction(body.from, body.methodName, ...body?.args)
    if (result != null){
      return;
    }
    return;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EthereumService } from 'src/ethereum/ethereum.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private readonly ethereumService: EthereumService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(address: string, username: string, password: string): Promise<any> {
    return await this.ethereumService.callContractTransaction(address, "authenticateEntity", ...[username, password]);
  }

  async verifyUser(address: string, username: string): Promise<any> {
    const user = await this.ethereumService.callContractTransaction(address, "getEntity");
  
    if (user["userName"] === username){
      return user;
    }

    return false
  }
}
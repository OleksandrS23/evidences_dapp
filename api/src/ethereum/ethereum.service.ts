import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import * as contractJSON from '../contracts/EvidenceChain.json'; // Import the contract JSON file

@Injectable()
export class EthereumService {
  private web3: Web3;
  private contract: any;
  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER),
    );
    this.contract = new this.web3.eth.Contract(
      contractJSON.abi,
      contractJSON.networks['5777'].address,
    );
  }

  async callMethod(contract: any, methodName: string, ...args: any[]) {
    return contract.methods[methodName](...args).call();
  }

  async sendContractTransaction(
    from: string,
    methodName: string,
    ...args: any[]
  ) {
    //var arg = [...args[0], {from: from}]
    var result = [];
    try {
      return await this.contract.methods[methodName](
        ...args
      ).send({
        from: from, // Specify the sender's Ethereum address
        gas: 2000000, // Set an appropriate gas limit
        // gasPrice: '20000000000' // Set an appropriate gas price
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }
}

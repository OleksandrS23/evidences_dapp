import Web3 from 'web3';
import EvidenceChain from "../contracts/EvidenceChain.json";

const web3 = new Web3(window.ethereum); 

const options = {
   web3:{
     customProvider: web3,
   },
  contracts: [EvidenceChain],
  events: {
    EvidenceChain: ["TransferOwnership", "ParticipantAdded", "EvidenceAdded" ],
  },
};

export default options;
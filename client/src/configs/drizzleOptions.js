import EvidenceChain from "../contracts/EvidenceChain.json";

const options = {
  contracts: [EvidenceChain],
  events: {
    EvidenceChain: ["TransferOwnership", "ParticipantAdded", "EvidenceAdded" ],
  },
};

export default options;
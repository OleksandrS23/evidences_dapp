import EvidenceChain from "../contracts/evidenceChain.json";

const options = {
  contracts: [EvidenceChain],
  events: {
    EvidenceChain: ["TransferOwnership", "ParticipantAdded", "EvidenceAdded", "" ],
  },
};

export default options;
pragma solidity >=0.8.0;

import "./EntitiesManager.sol";
import "./EvidencesManager.sol";

contract EvidenceChain {
    EntitiesManager public entitiesManager;
    EvidencesManager public evidencesManager;

    constructor(address _entitiesManagerAddress, address _evidencesManagerAddress) {
        entitiesManager = EntitiesManager(_entitiesManagerAddress);
        evidencesManager = EvidencesManager(_evidencesManagerAddress);
    }
    
    // uint32 public evidence_id = 0;
    uint32 public owner_id = 0;

    // struct Evidence {
    //     string evidenceUniqueCode;
    //     string evidenceName;
    //     string evidenceType;
    //     address evidenceOwner;
    //     uint32 mfgTimeStamp;
    // }

    // Evidence [] public evidences;
    
    struct ownership {
        uint32 evidenceId;
        uint32 ownerId;
        uint32 trxTimeStamp;
        address evidenceOwner;
    }

    mapping(uint32 => ownership) public ownerships;
    mapping(uint32 => uint32[]) public evidenceTrack;  

    event TransferOwnership(uint32 evidenceId);
    event ParticipantAdded(uint32 indexed userId);
    event EvidenceAdded(uint32 indexed evidenceId);

    function addEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode, string memory _entityType) public {
        entitiesManager.addEntity(_entity, _userName, _password, _name, _departmentCode, _entityType);
    }

    function getEntities() public view returns (EntitiesManager.Entity[] memory) {
        address[] memory entityAddresses = entitiesManager.getEntities();
        require(entityAddresses.length > 0, "No Entities");
        EntitiesManager.Entity[] memory entities = new EntitiesManager.Entity[](entityAddresses.length);
        for (uint32 i = 0; i < entityAddresses.length; i++) {
            entities[i] = entitiesManager.getLastUpdate(entityAddresses[i]);
        }

        return entities;
    }

    // function getEntities() public view returns (address[] memory) {
    //     return entitiesManager.getEntities();
    // }

    function getEntityHistory() public view returns (EntitiesManager.Entity[] memory) {
        return entitiesManager.getEntityHistory(msg.sender);
    }

    function getEntityHistory(address _entity) public view returns (EntitiesManager.Entity[] memory) {
        return entitiesManager.getEntityHistory(_entity);
    }

    function getEntity(address _entity) public view returns (EntitiesManager.Entity memory) {
        return entitiesManager.getLastUpdate(_entity);
    }

    function getEntity() public view returns (EntitiesManager.Entity memory) {
        return entitiesManager.getLastUpdate(msg.sender);
    }

    // function addParticipant(string memory _name, string memory _pass, address _pAdd, string memory _pType) public {
    //     uint32 userId = participant_id++;

    //     participants.push(Participant(_name, _pass, _pType, _pAdd));

    //     emit ParticipantAdded(userId);
    // }

    // function getParticipants() onlyParticipant() public view returns (Participant[] memory){
    //     return participants;
    // }

    // function getParticipant() public view returns (Participant memory) 
    // {
    //     for (uint32 i = 0; i < participants.length; i++) {
    //         if (participants[i].participantAddress == msg.sender) {
    //             return participants[i];
    //         }
    //     }
    //     revert("Participant not found");
    // }

    // modifier onlyParticipant() {
    //     require(isParticipant(), "The address was not found in the list.");
    //     _;
    // }

    // function isParticipant() internal view returns(bool) {
    // for (uint32 i = 0; i < participant_id; i++) {
    //     if (participants[i].participantAddress == msg.sender) {
    //         return true;
    //     }
    // }
    // return false;
    // }

    // function getParticipantId() internal view returns(int32) {
    // for (uint32 i = 0; i < participant_id; i++) {
    //     if (participants[i].participantAddress == msg.sender) {
    //         return int32(i);
    //     }
    // }
    // return -1;
    // }

    function addEvidence(string memory _evidenceUniqueCode, string memory _evidenceName, string memory _evidenceType) public {
        EntitiesManager.Entity memory _entity = entitiesManager.getLastUpdate(msg.sender);
        require(keccak256(abi.encodePacked(_entity.entityType)) == keccak256("Police"),"Not Police.");
        evidencesManager.addEvidence(_evidenceUniqueCode, _evidenceName, _evidenceType, _entity);
    }

    function getEvidences() public view returns (EvidencesManager.Evidence[] memory) {
        string[] memory evidencesCodes = evidencesManager.getEvidences();
        require(evidencesCodes.length > 0, "No Evidences");
        EvidencesManager.Evidence[] memory evidences = new EvidencesManager.Evidence[](evidencesCodes.length);
        for (uint32 i = 0; i < evidencesCodes.length; i++) {
            evidences[i] = evidencesManager.getLastUpdate(evidencesCodes[i]);
        }

        return evidences;
    }

    function getEvidenceHistory(string memory _evidenceUniqueCode) public view returns (EvidencesManager.Evidence[] memory) {
        return evidencesManager.getEvidenceHistory(_evidenceUniqueCode);
    }

    function getEvidence(string memory _evidenceUniqueCode) public view returns (EvidencesManager.Evidence memory) {
        return evidencesManager.getLastUpdate(_evidenceUniqueCode);
    }
    
    function evidenceNewOwner(string memory _evidenceUniqueCode, address _newOwner) onlyOwner(_evidenceUniqueCode) public {
        EvidencesManager.Evidence memory _evidence =  evidencesManager.getLastUpdate(_evidenceUniqueCode);
        EntitiesManager.Entity memory _entity =  entitiesManager.getLastUpdate(_newOwner);
        evidencesManager.updateOwner(_evidence.evidenceUniqueCode, _evidence.evidenceName, _evidence.evidenceType, _entity);
    } 

     modifier onlyOwner(string memory _evidenceUniqueCode) {
          EvidencesManager.Evidence memory _evidence =  evidencesManager.getLastUpdate(_evidenceUniqueCode);
          require(msg.sender == _evidence.evidenceOwner.entityAddress,"Not Owner");
          _;
     }


    // function addEvidence(string memory _evidenceUniqueCode,
    //                     string memory _evidenceName,
    //                     string memory _evidenceType) public 
    // {
    //     // require(verifyEvidenceUniqueCode(_evidenceUniqueCode));
    //     // int32 _ownerId = getParticipantId();
    //     // require(_ownerId >= 0, "Not Found Participant!");
    //     // require(keccak256(abi.encodePacked(participants[uint32(_ownerId)].participantType)) == keccak256("Police"),"Not Police.");
        
    //     uint32 evidenceId = evidence_id++;

    //     evidences.push(Evidence(_evidenceUniqueCode, _evidenceName, _evidenceType, msg.sender, uint32(block.timestamp)));
        
    //     // evidences[evidenceId].evidenceName = _evidenceName;
    //     // evidences[evidenceId].evidenceType = _evidenceType;
    //     // evidences[evidenceId].evidenceOwner = participants[_ownerId].participantAddress;
    //     // evidences[evidenceId].mfgTimeStamp = uint32(block.timestamp);

    //     //emit EvidenceAdded(evidenceId);
    // }

    // function verifyEvidenceUniqueCode(string memory _evidenceUniqueCode) internal view returns(bool) {
    // for (uint32 i = 0; i < evidence_id; i++) {
    //     if (keccak256(bytes(evidences[i].evidenceUniqueCode)) == keccak256(bytes(_evidenceUniqueCode))) {
    //         return false;
    //     }
    // }
    // return true;
    // }

    // function getEvidences() public view returns (Evidence[] memory){
    //     return evidences;
    // }

    // function getEvidence(uint32 _evidenceId) public view returns (string memory,string memory,address,uint32){
    //     return (evidences[_evidenceId].evidenceName,
    //             evidences[_evidenceId].evidenceType,
    //             evidences[_evidenceId].evidenceOwner,
    //             evidences[_evidenceId].mfgTimeStamp);
    // }


    // function newOwner(uint32 _user1Id,uint32 _user2Id, uint32 _evidId) onlyOwner(_evidId) public returns (bool) {
    //     Participant memory p1 = participants[_user1Id];
    //     Participant memory p2 = participants[_user2Id];
    //     uint32 ownership_id = owner_id++;

    //     if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Police")
    //         && keccak256(abi.encodePacked(p2.participantType))==keccak256("Lab")){
    //         ownerships[ownership_id].evidenceId = _evidId;
    //         ownerships[ownership_id].evidenceOwner = p2.participantAddress;
    //         ownerships[ownership_id].ownerId = _user2Id;
    //         ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
    //         evidences[_evidId].evidenceOwner = p2.participantAddress;
    //         evidenceTrack[_evidId].push(ownership_id);
    //         emit TransferOwnership(_evidId);

    //         return (true);
    //     }
    //     else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Lab") 
    //         && keccak256(abi.encodePacked(p2.participantType))==keccak256("Lab")){
    //         ownerships[ownership_id].evidenceId = _evidId;
    //         ownerships[ownership_id].evidenceOwner = p2.participantAddress;
    //         ownerships[ownership_id].ownerId = _user2Id;
    //         ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
    //         evidences[_evidId].evidenceOwner = p2.participantAddress;
    //         evidenceTrack[_evidId].push(ownership_id);
    //         emit TransferOwnership(_evidId);

    //         return (true);
    //     }
    //     else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Lab") 
    //         && keccak256(abi.encodePacked(p2.participantType))==keccak256("Court")){
    //         ownerships[ownership_id].evidenceId = _evidId;
    //         ownerships[ownership_id].evidenceOwner = p2.participantAddress;
    //         ownerships[ownership_id].ownerId = _user2Id;
    //         ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
    //         evidences[_evidId].evidenceOwner = p2.participantAddress;
    //         evidenceTrack[_evidId].push(ownership_id);
    //         emit TransferOwnership(_evidId);

    //         return (true);
    //     }

    //     return (false);
    // }

    function getProvenance(uint32 _evidenceId) external view returns (uint32[] memory) {
       return evidenceTrack[_evidenceId];
    }

    function getOwnership(uint32 _regId)  public view returns (uint32,uint32,address,uint32) {

        ownership memory r = ownerships[_regId];

         return (r.evidenceId ,r.ownerId ,r.evidenceOwner,r.trxTimeStamp);
    }

    // function authenticateParticipant(uint32 _uid,
    //                                 string memory _uname,
    //                                 string memory _pass,
    //                                 string memory _utype) public view returns (bool){
    //     if(keccak256(abi.encodePacked(participants[_uid].participantType)) == keccak256(abi.encodePacked(_utype))) {
    //         if(keccak256(abi.encodePacked(participants[_uid].userName)) == keccak256(abi.encodePacked(_uname))) {
    //             if(keccak256(abi.encodePacked(participants[_uid].password)) == keccak256(abi.encodePacked(_pass))) {
    //                 return (true);
    //             }
    //         }
    //     }

    //     return (false);
    // }
}
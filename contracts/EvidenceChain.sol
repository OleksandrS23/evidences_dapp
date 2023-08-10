pragma solidity >=0.8.0;

contract EvidenceChain {
    uint32 public evidence_id = 0;
    uint32 public participant_id = 0;
    uint32 public owner_id = 0;

    struct Evidence {
        string evidenceUniqueCode;
        string evidenceName;
        string evidenceType;
        address evidenceOwner;
        uint32 mfgTimeStamp;
    }

    Evidence [] private evidences;
    //mapping(uint32 => evidence) public evidences;

    struct Participant {
        string userName;
        string password;
        string participantType;
        address participantAddress;
    }
    //mapping(uint32 => participant) public participants;

    Participant[] private participants;

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

    function addParticipant(string memory _name, string memory _pass, address _pAdd, string memory _pType) public {
        uint32 userId = participant_id++;

        participants.push(Participant(_name, _pass, _pType, _pAdd));

        emit ParticipantAdded(userId);
    }

    function getParticipants() onlyParticipant() public view returns (Participant[] memory){
        return participants;
    }

    function getParticipant() public view returns (Participant memory) 
    {
        for (uint32 i = 0; i < participants.length; i++) {
            if (participants[i].participantAddress == msg.sender) {
                return participants[i];
            }
        }
        revert("Participant not found");
    }

    modifier onlyParticipant() {
        require(isParticipant(), "The address was not found in the list.");
        _;
    }

    function isParticipant() internal view returns(bool) {
    for (uint32 i = 0; i < participant_id; i++) {
        if (participants[i].participantAddress == msg.sender) {
            return true;
        }
    }
    return false;
    }

    function getParticipantId() internal view returns(int32) {
    for (uint32 i = 0; i < participant_id; i++) {
        if (participants[i].participantAddress == msg.sender) {
            return int32(i);
        }
    }
    return -1;
    }


    function addEvidence(string memory _evidenceUniqueCode,
                        string memory _evidenceName,
                        string memory _evidenceType) public 
    {
        require(verifyEvidenceUniqueCode(_evidenceUniqueCode));
        int32 _ownerId = getParticipantId();
        require(_ownerId >= 0, "Not Found Participant!");
        require(keccak256(abi.encodePacked(participants[uint32(_ownerId)].participantType)) == keccak256("Police"),"Not Police.");
        
        uint32 evidenceId = evidence_id++;

        evidences.push(Evidence(_evidenceUniqueCode, _evidenceName, _evidenceType, msg.sender, uint32(block.timestamp)));
        
        // evidences[evidenceId].evidenceName = _evidenceName;
        // evidences[evidenceId].evidenceType = _evidenceType;
        // evidences[evidenceId].evidenceOwner = participants[_ownerId].participantAddress;
        // evidences[evidenceId].mfgTimeStamp = uint32(block.timestamp);

        emit EvidenceAdded(evidenceId);
    }

    function verifyEvidenceUniqueCode(string memory _evidenceUniqueCode) internal view returns(bool) {
    for (uint32 i = 0; i < evidence_id; i++) {
        if (keccak256(bytes(evidences[i].evidenceUniqueCode)) == keccak256(bytes(_evidenceUniqueCode))) {
            return false;
        }
    }
    return true;
    }


    modifier onlyOwner(uint32 _evidenceId) {
         require(msg.sender == evidences[_evidenceId].evidenceOwner,"");
         _;

    }

    function getEvidences() onlyParticipant() public view returns (Evidence[] memory){
        return evidences;
    }

    function getEvidence(uint32 _evidenceId) public view returns (string memory,string memory,address,uint32){
        return (evidences[_evidenceId].evidenceName,
                evidences[_evidenceId].evidenceType,
                evidences[_evidenceId].evidenceOwner,
                evidences[_evidenceId].mfgTimeStamp);
    }


    function newOwner(uint32 _user1Id,uint32 _user2Id, uint32 _evidId) onlyOwner(_evidId) public returns (bool) {
        Participant memory p1 = participants[_user1Id];
        Participant memory p2 = participants[_user2Id];
        uint32 ownership_id = owner_id++;

        if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Police")
            && keccak256(abi.encodePacked(p2.participantType))==keccak256("Lab")){
            ownerships[ownership_id].evidenceId = _evidId;
            ownerships[ownership_id].evidenceOwner = p2.participantAddress;
            ownerships[ownership_id].ownerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
            evidences[_evidId].evidenceOwner = p2.participantAddress;
            evidenceTrack[_evidId].push(ownership_id);
            emit TransferOwnership(_evidId);

            return (true);
        }
        else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Lab") 
            && keccak256(abi.encodePacked(p2.participantType))==keccak256("Lab")){
            ownerships[ownership_id].evidenceId = _evidId;
            ownerships[ownership_id].evidenceOwner = p2.participantAddress;
            ownerships[ownership_id].ownerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
            evidences[_evidId].evidenceOwner = p2.participantAddress;
            evidenceTrack[_evidId].push(ownership_id);
            emit TransferOwnership(_evidId);

            return (true);
        }
        else if(keccak256(abi.encodePacked(p1.participantType)) == keccak256("Lab") 
            && keccak256(abi.encodePacked(p2.participantType))==keccak256("Court")){
            ownerships[ownership_id].evidenceId = _evidId;
            ownerships[ownership_id].evidenceOwner = p2.participantAddress;
            ownerships[ownership_id].ownerId = _user2Id;
            ownerships[ownership_id].trxTimeStamp = uint32(block.timestamp);
            evidences[_evidId].evidenceOwner = p2.participantAddress;
            evidenceTrack[_evidId].push(ownership_id);
            emit TransferOwnership(_evidId);

            return (true);
        }

        return (false);
    }

    function getProvenance(uint32 _evidenceId) external view returns (uint32[] memory) {
       return evidenceTrack[_evidenceId];
    }

    function getOwnership(uint32 _regId)  public view returns (uint32,uint32,address,uint32) {

        ownership memory r = ownerships[_regId];

         return (r.evidenceId ,r.ownerId ,r.evidenceOwner,r.trxTimeStamp);
    }

    function authenticateParticipant(uint32 _uid,
                                    string memory _uname,
                                    string memory _pass,
                                    string memory _utype) public view returns (bool){
        if(keccak256(abi.encodePacked(participants[_uid].participantType)) == keccak256(abi.encodePacked(_utype))) {
            if(keccak256(abi.encodePacked(participants[_uid].userName)) == keccak256(abi.encodePacked(_uname))) {
                if(keccak256(abi.encodePacked(participants[_uid].password)) == keccak256(abi.encodePacked(_pass))) {
                    return (true);
                }
            }
        }

        return (false);
    }
}
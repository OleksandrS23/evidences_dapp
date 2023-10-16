pragma solidity >=0.8.0;

import "./EntitiesManager.sol";
import "./EvidencesManager.sol";

contract EvidenceChain {
    EntitiesManager public entitiesManager;
    EvidencesManager public evidencesManager;

    constructor(
        address _entitiesManagerAddress,
        address _evidencesManagerAddress
    ) {
        entitiesManager = EntitiesManager(_entitiesManagerAddress);
        evidencesManager = EvidencesManager(_evidencesManagerAddress);
    }

    uint32 public owner_id = 0;

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

    function addEntity(
        address _entity,
        string memory _userName,
        string memory _password,
        string memory _name,
        string memory _departmentCode,
        EntitiesManager.EntityType _entityType
    ) public {
        entitiesManager.createEntity(
            _entity,
            _userName,
            _password,
            _name,
            _departmentCode,
            _entityType
        );
    }

    function updateEntity(
        address _entity,
        string memory _userName,
        string memory _password,
        string memory _name,
        string memory _departmentCode
    ) public {
        entitiesManager.updateEntity(
            _entity,
            _userName,
            _password,
            _name,
            _departmentCode
        );
    }

    function approveEntity(address _entityToBeApproved) public {
        entitiesManager.approveEntity(msg.sender, _entityToBeApproved);
    }

    function getEntities()
        public
        view
        returns (EntitiesManager.Entity[] memory)
    {
        address[] memory entityAddresses = entitiesManager.getEntities();
        require(entityAddresses.length > 0, "No Entities");
        EntitiesManager.Entity[] memory entities = new EntitiesManager.Entity[](
            entityAddresses.length
        );
        for (uint32 i = 0; i < entityAddresses.length; i++) {
            entities[i] = entitiesManager.getLastUpdate(entityAddresses[i]);
        }

        return entities;
    }

    function getEntityHistory()
        public
        view
        returns (EntitiesManager.Entity[] memory)
    {
        return entitiesManager.getEntityHistory(msg.sender);
    }

    function getEntityHistory(
        address _entity
    ) public view returns (EntitiesManager.Entity[] memory) {
        return entitiesManager.getEntityHistory(_entity);
    }

    function getEntity(
        address _entity
    ) public view returns (EntitiesManager.Entity memory) {
        return entitiesManager.getLastUpdate(_entity);
    }

    function getEntity() public view returns (EntitiesManager.Entity memory) {
        return entitiesManager.getLastUpdate(msg.sender);
    }

    function authenticateEntity(
        string memory _uname,
        string memory _pass
    ) public view returns (bool) {
        EntitiesManager.Entity memory entity = entitiesManager.getLastUpdate(
            msg.sender
        );

        if (
            keccak256(abi.encodePacked(entity.userName)) ==
            keccak256(abi.encodePacked(_uname))
        ) {
            if (
                keccak256(abi.encodePacked(entity.password)) ==
                keccak256(abi.encodePacked(_pass))
            ) {
                return (true);
            }
        }

        return (false);
    }

    function addEvidence(
        string memory _evidenceUniqueCode,
        string memory _caseNo,
        EvidencesManager.EvidenceClassification _classification,
        string memory _evidenceName,
        EvidencesManager.EvidenceType _evidenceType
    ) public {
        EntitiesManager.Entity memory _entity = entitiesManager.getLastUpdate(
            msg.sender
        );
        evidencesManager.addEvidence(
            _evidenceUniqueCode,
            _caseNo,
            _classification,
            _evidenceName,
            _evidenceType,
            _entity
        );
    }

    function getEvidences()
        public
        view
        returns (EvidencesManager.Evidence[] memory)
    {
        EntitiesManager.Entity memory entity = entitiesManager.getLastUpdate(
            msg.sender
        );
        return evidencesManager.getEvidences(entity);
    }

    function getEvidenceHistory(
        string memory _evidenceUniqueCode
    ) public view returns (EvidencesManager.Evidence[] memory) {
        EntitiesManager.Entity memory entity = entitiesManager.getLastUpdate(
            msg.sender
        );

        return evidencesManager.getEvidenceHistory(_evidenceUniqueCode, entity);
    }

    function getEvidence(
        string memory _evidenceUniqueCode
    ) public view returns (EvidencesManager.Evidence memory) {
        return evidencesManager.getLastUpdate(_evidenceUniqueCode);
    }

    function addAllowedUsers(
        string memory _evidenceUniqueCode,
        address[] memory _entities
    ) public onlyOwner(_evidenceUniqueCode) {
        EntitiesManager.Entity[] memory entities = new EntitiesManager.Entity[](
            _entities.length
        );

        for (uint32 i = 0; i < _entities.length; i++) {
            entities[i] = entitiesManager.getLastUpdate(_entities[i]);
        }

        evidencesManager.addAllowedUsers(_evidenceUniqueCode, entities);
    }

    function evidenceNewOwner(
        string memory _evidenceUniqueCode,
        address _newOwner
    ) public onlyOwner(_evidenceUniqueCode) {
        EntitiesManager.Entity memory _entity = entitiesManager.getLastUpdate(
            _newOwner
        );
        evidencesManager.updateOwner(_evidenceUniqueCode, _entity);
    }

    function addFile(
        string memory _evidenceUniqueCode,
        string memory _fileId,
        string memory _fileName,
        string memory _fileHash
    ) public onlyOwner(_evidenceUniqueCode) {
        EvidencesManager.EvidenceFile memory file = EvidencesManager
            .EvidenceFile(_fileId, _fileName, _fileHash);
        evidencesManager.addFile(_evidenceUniqueCode, file);
    }

    modifier onlyOwner(string memory _evidenceUniqueCode) {
        EvidencesManager.Evidence memory _evidence = evidencesManager
            .getLastUpdate(_evidenceUniqueCode);
        require(msg.sender == _evidence.owner.entityAddress, "Not Owner");
        _;
    }

    function getFileInfo(
        string memory _evidenceUniqueCode,
        string memory _fileUniqueCode
    ) external view returns (EvidencesManager.EvidenceFile memory) {
        return
            evidencesManager.getFileInfo(_evidenceUniqueCode, _fileUniqueCode);
    }

    // function getProvenance(
    //     uint32 _evidenceId
    // ) external view returns (uint32[] memory) {
    //     return evidenceTrack[_evidenceId];
    // }

    // function getOwnership(
    //     uint32 _regId
    // ) public view returns (uint32, uint32, address, uint32) {
    //     ownership memory r = ownerships[_regId];

    //     return (r.evidenceId, r.ownerId, r.evidenceOwner, r.trxTimeStamp);
    // }
}

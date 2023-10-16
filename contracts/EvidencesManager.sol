pragma solidity ^0.8.0;
import "./EntitiesManager.sol";
import "./EvidencesManagerAllowedUsers.sol";

contract EvidencesManager {
    EvidencesManagerAllowedUsers public evidencesManagerAllowedUsers;

    constructor(
        address _evidencesManagerAllowedUserAddress
    ) {
        evidencesManagerAllowedUsers = EvidencesManagerAllowedUsers(_evidencesManagerAllowedUserAddress);
    }

    enum ObservationsTipified{
        Created,
        Updated,
        Inactive,
        AddFile,
        UpdatedOwner,
        AddAllowedUser
    }

    enum EvidenceClassification {
    Public,
    Secret,
    AllowedPersonalOnly
    }

    enum EvidenceType {
    Document,
    Image,
    Video,
    Other
    }

    struct Evidence {
        string uniqueCode;
        string caseNo;
        EvidenceClassification classification;
        string name;
        EvidenceType eType;
        EntitiesManager.Entity owner;
        uint256 timestamp;
        string [] uFilesCodes;
        bool isActive;
        string observations;
    }

    mapping(string => Evidence[]) public evidencesHistory;

    struct EvidenceFile {
        string id;
        string fileName;
        string fileHash;
    }
    
    mapping(string => EvidenceFile[]) public evidencesFiles;

    string[] public allEvidences;

    function obsToString(ObservationsTipified _obs) public pure returns (string memory) {
        if (_obs == ObservationsTipified.Updated) {
            return "Updated";
        } else if (_obs == ObservationsTipified.Created) {
            return "Created";
        } else if (_obs == ObservationsTipified.AddFile) {
            return "Added File";
        } else if (_obs == ObservationsTipified.Inactive) {
            return "Inactivated";
        } else if (_obs == ObservationsTipified.UpdatedOwner) {
            return "Updated Owner";
        } else if (_obs == ObservationsTipified.AddAllowedUser) {
            return "Added Allowed User";
        } else {
            revert("Invalid status");
        }
    }

    function addEvidence(
            string memory _evidenceId, 
            string memory _caseNo, 
            EvidenceClassification _classification, 
            string memory _evidenceName, 
            EvidenceType _evidenceType, 
            EntitiesManager.Entity memory 
            _entity)
    public {
        if (evidencesHistory[_evidenceId].length == 0) 
        {
            evidencesHistory[_evidenceId].push(
                Evidence(_evidenceId, 
                _caseNo, 
                _classification,
                _evidenceName, 
                _evidenceType, 
                _entity, 
                block.timestamp, 
                new string[](0), 
                true, 
                obsToString(ObservationsTipified.Created)));

            allEvidences.push(_evidenceId);
        }
        else{
            Evidence memory lastUpdateEvidence = getLastUpdate(_evidenceId);
            require(lastUpdateEvidence.owner.entityAddress == _entity.entityAddress, "Not Owner");
            require(lastUpdateEvidence.isActive == true, "Evidence inactive");
            evidencesHistory[_evidenceId].push(
                    Evidence(_evidenceId, 
                            _caseNo, 
                            _classification,
                            _evidenceName, 
                            _evidenceType, 
                            _entity, 
                            block.timestamp, 
                            new string[](0), 
                            true, 
                            obsToString(ObservationsTipified.Updated)));
        }

        if (_classification == EvidenceClassification.AllowedPersonalOnly){
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceId, _entity);
        }
    }

    function addFile(string memory _evidenceId, EvidenceFile memory _file) public {
        Evidence memory evidence = getLastUpdate(_evidenceId);
        require(evidence.isActive == true, "Evidence inactive");
        string[] memory fileIds = new string[](1);
        fileIds[0] = _file.id;
        evidencesFiles[_evidenceId].push(EvidenceFile(_file.id, _file.fileName, _file.fileHash));

        evidencesHistory[_evidenceId].push(Evidence(_evidenceId, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, fileIds, true, obsToString(ObservationsTipified.AddFile)));
    }

    function addAllowedUsers (string memory _evidenceId, EntitiesManager.Entity[] memory _entities) public {
        Evidence memory evidence = getLastUpdate(_evidenceId);
        require(evidence.isActive == true, "Evidence inactive");
    
        for (uint32 i = 0; i < _entities.length; i++) {
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceId, _entities[i]);
            string memory _obs= string(abi.encodePacked(obsToString(ObservationsTipified.AddAllowedUser), ' ', _entities[i].userName));
            evidencesHistory[_evidenceId].push(Evidence(_evidenceId, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, new string[](0), true, _obs));
        }
    }


    function updateOwner(string memory _evidenceId, EntitiesManager.Entity memory _entity)public 
    {
        Evidence memory evidence = getLastUpdate(_evidenceId);
        require(evidence.isActive == true, "Evidence inactive");
        evidencesHistory[_evidenceId].push(Evidence(_evidenceId, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, _entity, block.timestamp, new string[](0), true, obsToString(ObservationsTipified.UpdatedOwner)));
        if (evidence.classification == EvidenceClassification.AllowedPersonalOnly){
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceId, _entity);
        }
    }

    function getEvidences(EntitiesManager.Entity memory entity) public view returns (EvidencesManager.Evidence[] memory) {
        require(allEvidences.length > 0, "No Evidences");

        EvidencesManager.Evidence[] memory evidences = new EvidencesManager.Evidence[](allEvidences.length);
        
        uint256 count = 0;
        for (uint32 i = 0; i < allEvidences.length; i++) {
            Evidence memory evidence = getLastUpdate(allEvidences[i]);
            if (evidencesManagerAllowedUsers.checkIfAllowed(evidence, entity))
            {
                evidences[count] = evidence;
                count++;
            }    
        }

        // Resize the memory array to the actual number of filtered results
        assembly {
            mstore(evidences, count)
        }

        return evidences;
    }

    function getEvidenceHistory(string memory _evidenceId, EntitiesManager.Entity memory entity) public view returns (Evidence[] memory) {
        Evidence memory evidence = getLastUpdate(_evidenceId);
        require(evidencesManagerAllowedUsers.checkIfAllowed(evidence, entity), "Not Allowed");
        
        return evidencesHistory[_evidenceId];
    }

    function getFileInfo(string memory _evidenceId, string memory _fileId) public view returns (EvidenceFile memory){
        EvidenceFile memory evidenceFile;
        for (uint256 i = 0; i < evidencesFiles[_evidenceId].length; i++) {
            if (keccak256(abi.encodePacked(evidencesFiles[_evidenceId][i].id)) == keccak256(abi.encodePacked(_fileId))) {
                return evidencesFiles[_evidenceId][i];
            }
        }
        return evidenceFile;
    }

    function getLastUpdate (string memory _evidenceId) public view returns (Evidence memory) {
        uint totalVersions = evidencesHistory[_evidenceId].length;
        require(totalVersions > 0, "Evidence not found");

        return evidencesHistory[_evidenceId][totalVersions - 1];
    }
}
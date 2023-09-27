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
    Video
    }

    struct EvidenceFile {
        string id;
        string fileName;
        string fileHash;
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

    function addEvidence(string memory _evidenceUniqueCode, string memory _caseNo, EvidenceClassification _classification, string memory _evidenceName, EvidenceType _evidenceType, EntitiesManager.Entity memory _entity) public {
        if (evidencesHistory[_evidenceUniqueCode].length == 0) 
        {
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, new string[](0), true, obsToString(ObservationsTipified.Created)));
            allEvidences.push(_evidenceUniqueCode);
        }
        else{
            uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
            Evidence memory lastEvidence = evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
            require(lastEvidence.owner.entityAddress == _entity.entityAddress, "Not Owner");
            require(lastEvidence.isActive == true, "Evidence inactive");
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, new string[](0), true, obsToString(ObservationsTipified.Updated)));
        }

        if (_classification == EvidenceClassification.AllowedPersonalOnly){
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceUniqueCode, _entity);
        }
    }

    function addFile(string memory _evidenceUniqueCode, EvidenceFile memory _file) public {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        require(evidence.isActive == true, "Evidence inactive");
        string[] memory fileIds = new string[](1);
        fileIds[0] = _file.id;
        evidencesFiles[_evidenceUniqueCode].push(EvidenceFile(_file.id, _file.fileName, _file.fileHash));

        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, fileIds, true, obsToString(ObservationsTipified.AddFile)));
    }

    function addAllowedUsers (string memory _evidenceUniqueCode, EntitiesManager.Entity[] memory _entities) public {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        require(evidence.isActive == true, "Evidence inactive");
        //require(evidence.classification == EvidenceClassification.AllowedPersonalOnly, "Not Classified as Allowed Personal Only");
    
        for (uint32 i = 0; i < _entities.length; i++) {
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceUniqueCode, _entities[i]);
            //string memory _obs= string(abi.encodePacked(obsToString(ObservationsTipified.AddAllowedUser), ' ', _entities[i].entityAddress, ' ', _entities[i].userName));
            string memory _obs= string(abi.encodePacked(obsToString(ObservationsTipified.AddAllowedUser), ' ', _entities[i].userName));
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, new string[](0), true, _obs));
        }
    }


    function updateOwner(string memory _evidenceUniqueCode, EntitiesManager.Entity memory _entity)public 
    {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        require(evidence.isActive == true, "Evidence inactive");
        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, _entity, block.timestamp, new string[](0), true, obsToString(ObservationsTipified.UpdatedOwner)));
        if (evidence.classification == EvidenceClassification.AllowedPersonalOnly){
            evidencesManagerAllowedUsers.addAllowedUser(_evidenceUniqueCode, _entity);
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

    function getEvidenceHistory(string memory _evidenceUniqueCode) public view returns (Evidence[] memory) {
        return evidencesHistory[_evidenceUniqueCode];
    }

    function getFileInfo(string memory _evidenceUniqueCode, string memory _fileId) public view returns (EvidenceFile memory){
        EvidenceFile memory evidenceFile;
        for (uint256 i = 0; i < evidencesFiles[_evidenceUniqueCode].length; i++) {
            if (keccak256(abi.encodePacked(evidencesFiles[_evidenceUniqueCode][i].id)) == keccak256(abi.encodePacked(_fileId))) {
                return evidencesFiles[_evidenceUniqueCode][i];
            }
        }
        return evidenceFile;
    }

    function getLastUpdate (string memory _evidenceUniqueCode) public view returns (Evidence memory) {
        uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
        require(totalVersions > 0, "Evidence not found");

        return evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
    }
}
pragma solidity ^0.8.0;
import "./EntitiesManager.sol";

contract EvidencesManager {
    
    struct EvidenceFile {
        string id;
        string fileName;
        string fileHash;
    }

    struct Evidence {
        string uniqueCode;
        string caseNo;
        string classification;
        string name;
        string eType;
        EntitiesManager.Entity owner;
        uint256 timestamp;
        string [] uFilesCodes;
    }

    mapping(string => Evidence[]) public evidencesHistory;
    mapping(string => EvidenceFile[]) public evidencesFiles;

    string[] public allEvidences;

    function addEvidence(string memory _evidenceUniqueCode, string memory _caseNo, string memory _classification, string memory _evidenceName, string memory _evidenceType, EntitiesManager.Entity memory _entity) public {
        if (evidencesHistory[_evidenceUniqueCode].length == 0) 
        {
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, new string[](0)));
            allEvidences.push(_evidenceUniqueCode);
        }
        else{
            uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
            Evidence memory lastEvidence = evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
            require(lastEvidence.owner.entityAddress == _entity.entityAddress, "Not Owner");
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, new string[](0)));
        }
    }

    // function addEvidence(string memory _evidenceUniqueCode, string memory _caseNo, string memory _classification, string memory _evidenceName, string memory _evidenceType, EntitiesManager.Entity memory _entity, EvidenceFile[] memory _files) public {
        
    //     string[] memory fileIds = new string[](_files.length);
        
    //     for (uint256 i = 0; i < _files.length; i++) {
    //         evidencesFiles[_evidenceUniqueCode].push(EvidenceFile(_files[i].id, _files[i].fileName, _files[i].fileHash));
    //         fileIds[i] = _files[i].id;
    //     }
        
    //     if (evidencesHistory[_evidenceUniqueCode].length == 0) 
    //     {
    //         evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, fileIds));
    //         allEvidences.push(_evidenceUniqueCode);
    //     }
    //     else{
    //         uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
    //         Evidence memory lastEvidence = evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
    //         require(lastEvidence.owner.entityAddress == _entity.entityAddress, "Not Owner");
    //         evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, fileIds));
    //     }
    // }

    function addFiles(string memory _evidenceUniqueCode, EvidenceFile[] memory _files) public {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        string[] memory fileIds = new string[](_files.length);

        for (uint256 i = 0; i < _files.length; i++) {
            evidencesFiles[_evidenceUniqueCode].push(EvidenceFile(_files[i].id, _files[i].fileName, _files[i].fileHash));
            fileIds[i] = _files[i].id;
        }

        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, fileIds));
    }

    function addFile(string memory _evidenceUniqueCode, EvidenceFile memory _file) public {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        string[] memory fileIds = new string[](1);
        fileIds[0] = _file.id;
        evidencesFiles[_evidenceUniqueCode].push(EvidenceFile(_file.id, _file.fileName, _file.fileHash));

        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, fileIds));
    }


    function updateOwner(string memory _evidenceUniqueCode, EntitiesManager.Entity memory _entity)public 
    {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, _entity, block.timestamp, new string[](0)));
    }

    function getEvidences() public view returns (string[] memory) {
        return allEvidences;
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
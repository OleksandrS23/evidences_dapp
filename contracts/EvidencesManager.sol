pragma solidity ^0.8.0;
import "./EntitiesManager.sol";

contract EvidencesManager {

    struct Evidence {
        string uniqueCode;
        string caseNo;
        string classification;
        string name;
        string eType;
        EntitiesManager.Entity owner;
        uint256 timestamp;
        string [] uFiles;
    }

    mapping(string => Evidence[]) public evidencesHistory;
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

    function addEvidence(string memory _evidenceUniqueCode, string memory _caseNo, string memory _classification, string memory _evidenceName, string memory _evidenceType, EntitiesManager.Entity memory _entity, string[] memory _files) public {
        if (evidencesHistory[_evidenceUniqueCode].length == 0) 
        {
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, _files));
            allEvidences.push(_evidenceUniqueCode);
        }
        else{
            uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
            Evidence memory lastEvidence = evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
            require(lastEvidence.owner.entityAddress == _entity.entityAddress, "Not Owner");
            evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _caseNo, _classification,_evidenceName, _evidenceType, _entity, block.timestamp, _files));
        }
    }

    function addFiles(string memory _evidenceUniqueCode, string[] memory _files) public {
        Evidence memory evidence = getLastUpdate(_evidenceUniqueCode);
        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, evidence.caseNo, evidence.classification, evidence.name, evidence.eType, evidence.owner, block.timestamp, _files));
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

    function getLastUpdate (string memory _evidenceUniqueCode) public view returns (Evidence memory) {
        uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
        require(totalVersions > 0, "Evidence not found");

        return evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
    }
}
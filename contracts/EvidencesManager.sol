pragma solidity ^0.8.0;
import "./EntitiesManager.sol";

contract EvidencesManager {

    struct Evidence {
        string evidenceUniqueCode;
        string evidenceName;
        string evidenceType;
        EntitiesManager.Entity evidenceOwner;
        uint256 timestamp;
    }

    mapping(string => Evidence[]) public evidencesHistory;
    string[] public allEvidences;

    function addEvidence(string memory _evidenceUniqueCode, string memory _evidenceName, string memory _evidenceType, EntitiesManager.Entity memory _entity) public {
        evidencesHistory[_evidenceUniqueCode].push(Evidence(_evidenceUniqueCode, _evidenceName, _evidenceType, _entity, block.timestamp));
        if (evidencesHistory[_evidenceUniqueCode].length == 1) 
        {
            allEvidences.push(_evidenceUniqueCode);
        }
    }

    function getEvidences() public view returns (string[] memory) {
        return allEvidences;
    }

    function getEvidenceHistory(string memory _evidenceUniqueCode) public view returns (Evidence[] memory) {
        return evidencesHistory[_evidenceUniqueCode];
    }

    function getLastUpdate (string memory _evidenceUniqueCode) public view returns (Evidence memory) {
        uint totalVersions = evidencesHistory[_evidenceUniqueCode].length;
        require(totalVersions > 0, "Evidence nao encontrado");

        return evidencesHistory[_evidenceUniqueCode][totalVersions - 1];
    }
}
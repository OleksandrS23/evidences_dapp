pragma solidity ^0.8.0;
import "./EntitiesManager.sol";
import "./EvidencesManager.sol";

contract EvidencesManagerAllowedUsers {
    mapping(string => EntitiesManager.Entity[]) public evidencesAllowedUsers;

    function addAllowedUser(string memory _evidenceUniqueCode, EntitiesManager.Entity memory _entity) public {
        bool alreadyAllowed = false;
        for (uint32 i = 0; i < evidencesAllowedUsers[_evidenceUniqueCode].length; i++) {
            EntitiesManager.Entity memory entity = evidencesAllowedUsers[_evidenceUniqueCode][i];
            if (entity.entityAddress == _entity.entityAddress){
                alreadyAllowed = true;
            }
        }
        if(alreadyAllowed == false){
            evidencesAllowedUsers[_evidenceUniqueCode].push(_entity);
        }
    }

    function checkIfAllowed (EvidencesManager.Evidence memory evidence, EntitiesManager.Entity memory entity) public view returns (bool)
    {
        if (entity.entityType == EntitiesManager.EntityType.Court){
            return true;
        }
        
        if (evidence.classification == EvidencesManager.EvidenceClassification.Public){
            return true;
        }

        if (entity.entityType == EntitiesManager.EntityType.Forensics && evidence.classification != EvidencesManager.EvidenceClassification.AllowedPersonalOnly){
            return true;
        }

        if (evidence.classification == EvidencesManager.EvidenceClassification.AllowedPersonalOnly || evidence.classification == EvidencesManager.EvidenceClassification.Secret){
            EntitiesManager.Entity[] memory allowedEntities= evidencesAllowedUsers[evidence.uniqueCode];
            for (uint32 i = 0; i < allowedEntities.length; i++){
                EntitiesManager.Entity memory allowed = allowedEntities[i];
                if (entity.entityAddress == allowed.entityAddress){
                    return true;
                }
            }
        }
        
        return false;
    }
}

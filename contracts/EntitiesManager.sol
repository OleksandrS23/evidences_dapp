pragma solidity ^0.8.0;

contract EntitiesManager {

    enum EntityType {
    LawEnforcementAgent,
    Forensics,
    Court,
    Lawyer
    }

    struct Entity {
        string userName;
        string password;
        string name;
        string departmentCode;
        EntityType entityType;
        address entityAddress;
        uint32 timestamp;
    }

    mapping(address => Entity[]) public entitiesHistory;
    address[] public allEntities;

    function createEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode, EntityType _entityType) public {
        require(entitiesHistory[_entity].length == 0, "Already Registred");
        if (entitiesHistory[_entity].length == 0) 
        {
            entitiesHistory[_entity].push(Entity(_userName, _password, _name, _departmentCode, _entityType, _entity,  uint32(block.timestamp)));
            allEntities.push(_entity);
        }
    }

    function updateEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode) public {
        require(keccak256(bytes(entitiesHistory[_entity][(entitiesHistory[_entity].length)-1].userName)) == keccak256(bytes(_userName)), "User Name Didn't Match");
        require(keccak256(bytes(entitiesHistory[_entity][(entitiesHistory[_entity].length)-1].password)) == keccak256(bytes(_password)), "Password Didn't Match");
        Entity memory lastUpdate = getLastUpdate(_entity);
        entitiesHistory[_entity].push(Entity(_userName, _password, _name, _departmentCode, lastUpdate.entityType, _entity,  uint32(block.timestamp)));
    }

    function getEntities() public view returns (address[] memory) {
        return allEntities;
    }

    function getEntityHistory(address _entity) public view returns (Entity[] memory) {
        return entitiesHistory[_entity];
    }

    function getLastUpdate (address _entity) public view returns (Entity memory) {
        uint totalVersions = entitiesHistory[_entity].length;
        require(totalVersions > 0, "Entity Not Found");

        return entitiesHistory[_entity][totalVersions - 1];
    }
}
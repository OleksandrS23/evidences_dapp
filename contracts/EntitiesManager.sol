pragma solidity ^0.8.0;

contract EntitiesManager {

    struct Entity {
        string userName;
        string password;
        string name;
        string departmentCode;
        string entityType;
        address entityAddress;
        uint32 timestamp;
    }

    mapping(address => Entity[]) public entitiesHistory;
    address[] public allEntities;

    function addEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode, string memory _entityType) public {
        entitiesHistory[_entity].push(Entity(_userName, _password, _name, _departmentCode, _entityType, _entity,  uint32(block.timestamp)));
        if (entitiesHistory[_entity].length == 1) 
        {
            allEntities.push(_entity);
        }
    }

    function getEntities() public view returns (address[] memory) {
        return allEntities;
    }

    function getEntityHistory(address _entity) public view returns (Entity[] memory) {
        return entitiesHistory[_entity];
    }

    function getLastUpdate (address _entity) public view returns (Entity memory) {
        uint totalVersions = entitiesHistory[_entity].length;
        require(totalVersions > 0, "Participante nao encontrado");

        return entitiesHistory[_entity][totalVersions - 1];
    }
}
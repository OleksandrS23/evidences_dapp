pragma solidity ^0.8.0;

contract EntitiesManager {

    enum EntityType {
    LawEnforcementAgent,
    Forensics,
    Court,
    Lawyer,
    Administrator
    }

    struct Entity {
        string userName;
        string password;
        string name;
        string departmentCode;
        EntityType entityType;
        address entityAddress;
        uint256 timestamp;
        bool isApproved;
        address approverAddress;
    }

    mapping(address => Entity[]) public entitiesHistory;
    address[] public allEntities;

    function createEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode, EntityType _entityType) public {
        require(entitiesHistory[_entity].length == 0, "Already Registred");
        if (entitiesHistory[_entity].length == 0) 
        {
            entitiesHistory[_entity].push(Entity(_userName, _password, _name, _departmentCode, _entityType, _entity,  block.timestamp, false, _entity));
            allEntities.push(_entity);
        }
    }

    function updateEntity(address _entity, string memory _userName, string memory _password, string memory _name, string  memory _departmentCode) public {
        Entity memory entity = getLastUpdate(_entity);
        require(keccak256(bytes(entity.userName)) == keccak256(bytes(_userName)), "User Name Didn't Match");
        require(keccak256(bytes(entity.password)) == keccak256(bytes(_password)), "Password Didn't Match");
        entitiesHistory[_entity].push(Entity(_userName, _password, _name, _departmentCode, entity.entityType, _entity,  block.timestamp, false, _entity));
    }

    function approveEntity(address _entity, address _entityToBeApproved) public {
        Entity memory entity = getLastUpdate(_entity);
        require(entity.entityType == EntityType.Administrator, "Not Administrator");
        Entity memory entityToBeApproved = getLastUpdate(_entityToBeApproved);
        require(entityToBeApproved.isApproved == false, "Already Approved");
        
        entitiesHistory[_entityToBeApproved].push(Entity(entityToBeApproved.userName, entityToBeApproved.password, entityToBeApproved.name, entityToBeApproved.departmentCode, entityToBeApproved.entityType, entityToBeApproved.entityAddress,  block.timestamp, true, _entity));
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
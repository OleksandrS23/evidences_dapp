const EvidenceChain = artifacts.require("./EvidenceChain.sol");
const EntitiesManager = artifacts.require("./EntitiesManager.sol")
const EvidencesManager = artifacts.require("./EvidencesManager.sol")
const EvidencesManagerAllowedUsers = artifacts.require("./EvidencesManagerAllowedUsers.sol")

module.exports = async function(deployer) {
    await deployer.deploy(EntitiesManager);
    const entitiesManagerInstance = await EntitiesManager.deployed();
    await deployer.deploy(EvidencesManagerAllowedUsers);
    const evidencesManagerAllowedUsersInstance = await EvidencesManagerAllowedUsers.deployed();
    await deployer.deploy(EvidencesManager, evidencesManagerAllowedUsersInstance.address);
    const evidencesManagerInstance = await EvidencesManager.deployed();
    await deployer.deploy(EvidenceChain, entitiesManagerInstance.address, evidencesManagerInstance.address);
};
const EvidenceChain = artifacts.require("./EvidenceChain.sol");

module.exports = function(deployer) {
    deployer.deploy(EvidenceChain);
};
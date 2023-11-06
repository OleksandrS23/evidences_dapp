const EvidenceChain = artifacts.require("EvidenceChain");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('EvidenceChain', async accounts => {
  it("should create a Entity", async () => {
    let instance = await EvidenceChain.deployed();
    let entityId = await instance.addEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc","userA","passA", "Olek Sla","LAPA", 4);
    let entity = await instance.getEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc");
    
    console.log(entity)
    assert.equal(entity.userName, "userA");
    assert.equal(entity.name, "Olek Sla");

    entityId = await instance.addEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2","userB","passB", "Olek Sla B","LAPA B", 1);
    entity = await instance.getEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2");
    assert.equal(entity.userName, "userB");
    assert.equal(entity.entityType, 1);

    entityId = await instance.addEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F","userC","passC", "Olek Sla C","LAPA C", 2);
    entity = await instance.getEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F");
    assert.equal(entity.userName, "userC");
    assert.equal(entity.entityType, 2);
  });

  it("should return entity details", async () => {
    let instance = await EvidenceChain.deployed();
    let entityDetails = await instance.getEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F");
    assert.equal(entityDetails.userName, "userC");

    instance = await EvidenceChain.deployed();
    entityDetails = await instance.getEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc");
    assert.equal(entityDetails.userName, "userA");
    assert.equal(entityDetails.isApproved, false);

    instance = await EvidenceChain.deployed();
    entityDetails = await instance.getEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2");
    assert.equal(entityDetails.userName, "userB");
  })

  it("should aprove entity register", async() =>{
    let instance = await EvidenceChain.deployed();
    await instance.approveEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    
    instance = await EvidenceChain.deployed();
    let entityDetails = await instance.getEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F");
    assert.equal(entityDetails.isApproved, true);
    assert.equal(entityDetails.approverAddress, "0x3bB54a018F3c29625162a78830c39A74227c8cAc");

    instance = await EvidenceChain.deployed();
    await instance.approveEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    entityDetails = await instance.getEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2");
    assert.equal(entityDetails.isApproved, true);
    assert.equal(entityDetails.approverAddress, "0x3bB54a018F3c29625162a78830c39A74227c8cAc");
  })
});

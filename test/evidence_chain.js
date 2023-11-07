const EvidenceChain = artifacts.require("EvidenceChain");
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('EvidenceChain', async accounts => {
  it("create a Entity", async () => {
    let instance = await EvidenceChain.deployed();
    let entityId = await instance.addEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc","userA","passA", "Olek Sla","LAPA", 4);
    let entity = await instance.getEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc");

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

    entityId = await instance.addEntity("0x446c38695052c718D06716F704B312AF70A23989","userD","passD", "Olek Sla D","LAPA D", 4);
    entity = await instance.getEntity("0x446c38695052c718D06716F704B312AF70A23989");
    assert.equal(entity.userName, "userD");
    assert.equal(entity.entityType, 4);
  });

  it("return entity details", async () => {
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

  it("aprove entity register", async() =>{
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

    instance = await EvidenceChain.deployed();
    await instance.approveEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    entityDetails = await instance.getEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc");
    assert.equal(entityDetails.isApproved, true);
    assert.equal(entityDetails.approverAddress, "0x3bB54a018F3c29625162a78830c39A74227c8cAc");
  })

  it("already aproved entity register", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = instance.approveEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    truffleAssert.reverts(result, 'Already Approved')
    
    instance = await EvidenceChain.deployed();
    let entityDetails = await instance.getEntity("0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F");
    assert.equal(entityDetails.isApproved, true);
    assert.equal(entityDetails.approverAddress, "0x3bB54a018F3c29625162a78830c39A74227c8cAc");

    instance = await EvidenceChain.deployed();
    result = instance.approveEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    truffleAssert.reverts(result, 'Already Approved')
    entityDetails = await instance.getEntity("0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2");
    assert.equal(entityDetails.isApproved, true);
    assert.equal(entityDetails.approverAddress, "0x3bB54a018F3c29625162a78830c39A74227c8cAc");
  })

  it("update entity", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.updateEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc","userA","passA", "Olek Sla AAA","LAPA Updated", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    
    instance = await EvidenceChain.deployed();
    let entityDetails = await instance.getEntity("0x3bB54a018F3c29625162a78830c39A74227c8cAc");
    assert.equal(entityDetails.isApproved, false);
    assert.equal(entityDetails.departmentCode, "LAPA Updated")
    assert.equal(entityDetails.name, "Olek Sla AAA")
  })

  it("get entities", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.getEntities()
    assert.equal(result.length, 4)
  })

  it("get history of entity", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.getEntityHistory("0x3bB54a018F3c29625162a78830c39A74227c8cAc")

    assert.equal(result[0].name, "Olek Sla")
    assert.equal(result[0].isApproved, false)

    assert.equal(result[1].isApproved, true)

    assert.equal(result[2].name, "Olek Sla AAA")
    assert.equal(result[2].isApproved, false)
  })

  it("get history of entity length", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.getEntityHistory("0x3bB54a018F3c29625162a78830c39A74227c8cAc")

    assert.equal(result.length, 3)
  })

  it("authenticate entity failed", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.authenticateEntity("a", "b", {from:"0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    assert.equal(result, false)
  })

  it("authenticate entity success", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.authenticateEntity("userA", "passA", {from:"0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    assert.equal(result, true)
  })

  it("get evidences while none", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = instance.getEvidences()
    truffleAssert.reverts(result, "No Evidences")
  })

  it("add evidence unregistred user", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = instance.addEvidence("0", "case0", 0, "Evidence Name", 0,{from:"0xA686f2FEfdb296859AD97728c44AC16fD57B6Edd"})
    truffleAssert.reverts(result, "Entity Not Found")
  })

  it("add private evidence", async() =>{
    let instance = await EvidenceChain.deployed();
    let result = await instance.addEvidence("0", "case0", 2, "Evidence Name", 0,{from:"0x446c38695052c718D06716F704B312AF70A23989"})
    
    result = await instance.getEvidence("0", {from:"0x446c38695052c718D06716F704B312AF70A23989"})

    assert.equal(result.owner.name, "Olek Sla D")
    assert.equal(result.eType, 0)
  })

  it("cannot access an private evidence without permition", async() =>{
    let instance = await EvidenceChain.deployed();
    
    result = await instance.getEvidences()
    assert.equal(result.length, 0)

  })

  it("can access an private evidence being Court", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = await instance.getEvidences({from: "0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F"})
    assert.equal(result.length, 1)
  })

  it("add access to an entity not being owner", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = instance.addAllowedUsers("0",["0x3bB54a018F3c29625162a78830c39A74227c8cAc"], {from: "0x276E8CB43cCEe5144fF462217e471157Fc43Ba6F"})
    truffleAssert.reverts(result, "Not Owner")
  })

  it("add access to an entity being owner", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = await instance.addAllowedUsers("0",["0x3bB54a018F3c29625162a78830c39A74227c8cAc"], {from: "0x446c38695052c718D06716F704B312AF70A23989"})
    
    result = await instance.getEvidences({from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    assert.equal(result.length, 1)
    
  })

  it("evidence new owner not being owner", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = instance.evidenceNewOwner("0", "0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2", {from: "0x3bB54a018F3c29625162a78830c39A74227c8cAc"})
    
    truffleAssert.reverts(result, "Not Owner")
  })

  it("evidence new owner being owner", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = await instance.evidenceNewOwner("0", "0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2", {from: "0x446c38695052c718D06716F704B312AF70A23989"})
    
    let evidence = await instance.getEvidence("0")
    assert.equal(evidence.owner.entityAddress, "0xFE2B5b2470d64C211DDDCB3eF2b613b190F8C3c2")
  })

  it("evidence history", async() =>{
    let instance = await EvidenceChain.deployed();
    
    let result = await instance.getEvidenceHistory("0")
    assert.equal(result.length, 3)
  })

});

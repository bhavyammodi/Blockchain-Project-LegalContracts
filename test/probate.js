var Will = artifacts.require("./Will.sol");

contract('Probate', async (accounts) => {

  var will;
  var contractOwner = accounts[0];
  var testatorAccount = accounts[1];
  var administratorAccount = accounts[2];
  var daughter1Account = accounts[3];
  var strangerAccount = accounts[9];

  beforeEach("create a new instance of the will each time", async() => {
    will = await Will.new(contractOwner);
  });

  it("should have the contractOwner assigned at deploy time", async() => {
    let assignedOwner = await will.contractOwner();
    expect(assignedOwner).to.exist;
    expect(assignedOwner).to.be.a('string');
    expect(assignedOwner).to.equal(contractOwner);
  });

  it("allows contractOwner to define testator", async() => {
    await will.designateTestator(testatorAccount, {from:contractOwner});
    let assignedTestator = await will.testator();
    expect(assignedTestator).to.exist;
    expect(assignedTestator).to.be.a('string');
    expect(assignedTestator).to.equal(testatorAccount);
  });

  it("prevents anyone but contractOwner from defining testator", async() => {
    await expectRevert(
      will.designateTestator.call(testatorAccount, {from: strangerAccount}),
      "only contract owner may call this function"
    );
  });

  it("allows the testator to appoint an administrator", async() => {
    await will.designateTestator(testatorAccount, {from:contractOwner});
    await will.appointAdministrator(administratorAccount, {from:testatorAccount});
    let assignedAdministrator = await will.administrator();
    expect(assignedAdministrator).to.exist;
    expect(assignedAdministrator).to.be.a('string');
    expect(assignedAdministrator).to.equal(administratorAccount);
  });

  it("lets the testator add a beneficiary", async() => {
    await will.designateTestator(testatorAccount, {from: contractOwner});
    await will.appointAdministrator(administratorAccount, {from: testatorAccount});

    await will.addBeneficiary(daughter1Account, 50, {from: testatorAccount});

    let assignedShare = await will.beneficiaries(daughter1Account);
    expect(assignedShare).to.exist;
    expect(assignedShare.toNumber()).to.equal(50);
  });

  it("prevents anyone but the testator from adding a beneficiary", async() => {
    await will.designateTestator(testatorAccount, {from: contractOwner});

    await expectRevert(
      will.addBeneficiary(daughter1Account, 50, {from: strangerAccount}),
      "only testator may call this function"
    );
  });

  async function expectRevert(promise, errorMessage) {
    try {
      await promise;
      assert.fail("Expected revert not received");
    } catch (error) {
      assert.include(error.message, errorMessage, "Expected error message not received");
    }
  }
});

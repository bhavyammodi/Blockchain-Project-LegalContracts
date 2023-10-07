var BillOfSale = artifacts.require("./BillOfSale.sol", 1);

contract('Bill of Sale...', async (accounts) => {

  var billOfSale;
  var contractOwnerAccount = accounts[0];
  var sellerAccount = accounts[0];
  var buyerAccount = accounts[1];
  var strangerAccount = accounts[2];
  var saleAmount = 5 * 1000000000000000000;
  var additionalTermsIpfsHash = "QmZfwvbQQJzHScguKPPPNLe2Bff9mnTJAFS7w37CqdqwPN";

  beforeEach('get reference to bill of sale before each test', async() => {
    billOfSale = await BillOfSale.new(contractOwnerAccount, sellerAccount,
      buyerAccount, additionalTermsIpfsHash);
  });

  it("deploys and asserts to true", async () => {
     let bos = await BillOfSale.deployed();
     assert.isTrue(true);
  });

  it ("has a contractOwner set at deployment", async () => {
    let contractOwner = await billOfSale.contractOwner();
    assert.isTrue(contractOwner == sellerAccount, "expected: " + sellerAccount + " got: " + contractOwner);
  });

  it ("has seller set at deployment", async () => {
    let seller = await billOfSale.seller();
    assert.isTrue(seller == sellerAccount, "expected: " + sellerAccount + " got: " + seller);
  });

  it ("has buyer set at deployment", async () => {
    let buyer = await billOfSale.buyer();
    assert.isTrue(buyer == buyerAccount, "expected: " + buyerAccount + " got: " + buyer);
  });

  it ("has additionalTerms set at deployment", async () => {
    let additionalTerms = await billOfSale.additionalTerms.call();
    assert.isOk(additionalTerms, "expected ok; got: " + additionalTerms);
  });

  it ("does not let the someone other than seller define salePrice", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.setSalePrice.call(saleAmount, {from: buyerAccount})
    }).then(function (noErrorThrown) {
      assert.isTrue(false, "should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("allows the seller to define the chattel", async() => {
    await billOfSale.setPersonalProperty("solidity legal forms", {from: sellerAccount});
    let assignedPersonalProperty = await billOfSale.personalProperty.call().valueOf();

    assert.isTrue(assignedPersonalProperty == "solidity legal forms", "personalProperty not set correctly (got: " + assignedPersonalProperty + ")")
  });

  it ("does not let the buyer define the chattel", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.setPersonalProperty.call("chattel", {from: buyerAccount})
    }).then(function (noErrorThrown) {
      assert.isTrue(false, "should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("allows seller to define the delivery method", async() => {
    await billOfSale.setDeliveryMethod("fedex overnight", {from: sellerAccount});
    let assignedDM = await billOfSale.deliveryMethod.call().valueOf();

    assert.isTrue(assignedDM == "fedex overnight", "deliveryMethod not set correctly (got: " + assignedDM + ")")
  });

  it ("allows buyer to define the method of delivery", async() => {
    await billOfSale.setDeliveryMethod("fedex overnight", {from: buyerAccount});
    let assignedDM = await billOfSale.deliveryMethod.call().valueOf();

    assert.isTrue(assignedDM == "fedex overnight", "deliveryMethod not set correctly (got: " + assignedDM + ")")
  });

  it ("fails if a stranger to the contract tries define delivery method", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.setDeliveryMethod.call("fedex", {from: strangerAccount})
    }).then(function (noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("allows the seller to manifest asset", async() => {
    await billOfSale.recordSellerAssent({from: sellerAccount});
    let sellerAssent = await billOfSale.sellerAssent.call().valueOf();
    assert.isOk(sellerAssent, "seller assent should be recorded");
  });

  it ("throws error if someone other than seller tries to assent for seller", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.recordSellerAssent.call({from: strangerAccount});
    }).then(function(noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("allows the buyer to manifest asset", async() => {
    await billOfSale.recordBuyerAssent({from: buyerAccount});
    let buyerAssent = await billOfSale.buyerAssent.call().valueOf();
    assert.isOk(buyerAssent, "buyer assent should be recorded");
  });

  it ("throws error if someone other than buyer tries to assent for buyer", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.recordBuyerAssent.call({from: strangerAccount});
    }).then(function(noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("fails if someone tries to declare the property was received without full assent", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.confirmPropertyReceived.call({from:buyerAccount});
    }).then(function (noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("throws error if seller tries to withdraw before buyer confirms receipt", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.sellerWithdraw.call({from: sellerAccount})
    }).then(function(noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("fails if anyone other than buyer account tries to set the property received flag", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.confirmPropertyReceived.call({from:strangerAccount})
    }).then(function (noErrorThrown) {
      assert.isTrue(false, "should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("fails if the wrong amount gets paid to the contract", function() {
    return BillOfSale.deployed().then(function(bos) {
      var wrongAmount = saleAmount + 2; //TODO - someday figure out why adding only one doesn't work. mind blown
      return bos.sendTransaction({from: buyerAccount, value: wrongAmount});
    }).then(function(noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });

  it ("throws an error if someone other than seller tries to withdraw", function() {
    return BillOfSale.deployed().then(function(bos) {
      return bos.sellerWithdraw.call({from: strangerAccount})
    }).then(function(noErrorThrown) {
      assert.fail("should have failed");
    }, function (errorThrown) {
      assert.isTrue(true, "failure caught");
    });
  });


});


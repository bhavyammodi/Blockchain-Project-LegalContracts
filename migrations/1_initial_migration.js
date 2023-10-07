var Migrations = artifacts.require("./Migrations.sol");
var BillOfSale = artifacts.require("./BillOfSale.sol");
var Will = artifacts.require("./Will.sol");

var additionalTermsIpfsHash = "FJKSDNFKJSDNFIJEHRIOUWjnfjksnfjwenkwjntroiu289";

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  let ownerAccount = accounts[0];
  let sellerAccount = ownerAccount;
  let buyerAccount = accounts[1];

  deployer.deploy(BillOfSale, ownerAccount, sellerAccount, buyerAccount,
    additionalTermsIpfsHash);

  deployer.deploy(Will, ownerAccount);

};

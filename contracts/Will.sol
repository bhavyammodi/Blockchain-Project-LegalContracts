  pragma solidity ^0.5.16;

  contract Will {
    address public contractOwner;
    address public testator;
    address public administrator;
    mapping(address => uint256) public beneficiaries;

    constructor(address _contractOwner) public {
      contractOwner = _contractOwner;
    }

    function designateTestator(address _testator) public contractOwnerOnly {
      testator = _testator;
    }

    function appointAdministrator(address _administrator) public testatorOnly {
      administrator = _administrator;
    }

    function addBeneficiary(address beneficiary, uint256 share) public testatorOnly {
      beneficiaries[beneficiary] = share;
    }

    modifier contractOwnerOnly() {
      require(msg.sender == contractOwner, "only contract owner may call this function");
      _;
    }

    modifier testatorOnly() {
      require(testator != address(0), "testator must be defined first");
      require(msg.sender == testator, "only testator may call this function");
      _;
    }

  }

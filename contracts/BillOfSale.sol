pragma solidity ^0.5.16;

contract BillOfSale {
    address public contractOwner;
    address payable public seller;
    address public buyer;
    uint256 public salePrice;
    string public additionalTerms;
    string public personalProperty;
    string public deliveryMethod;
    bool public sellerAssent = false;
    bool public buyerAssent = false;
    bool public propertyReceived = false;
    bool public fullyPerformed = false;

    constructor(address _contractOwner, address payable _seller, address _buyer, string memory _additionalTerms) public {
        contractOwner = _contractOwner;
        seller = _seller;
        buyer = _buyer;
        additionalTerms = _additionalTerms;
    }

    event TransactionPerformed();

    function setSalePrice(uint256 _salePrice) public sellerOnly {
        require(salePrice == 0, "Sale price already set");
        salePrice = _salePrice;
    }

    function setPersonalProperty(string memory _personalProperty) public sellerOnly {
        require(bytes(personalProperty).length == 0, "Personal property description already set");
        personalProperty = _personalProperty;
    }

    function setDeliveryMethod(string memory _deliveryMethod) public buyerOrSellerOnly {
        require(bytes(deliveryMethod).length == 0, "Delivery method already set");
        deliveryMethod = _deliveryMethod;
    }

    function recordSellerAssent() public sellerOnly {
        require(!sellerAssent, "Seller already gave assent");
        sellerAssent = true;
    }

    function recordBuyerAssent() public buyerOnly {
        require(!buyerAssent, "Buyer already gave assent");
        buyerAssent = true;
    }

    function confirmPropertyReceived() public buyerOnly performanceReviewed preventIncompleteAssent {
        require(!propertyReceived, "Property already received");
        propertyReceived = true;
    }

    function() external payable performanceReviewed preventIncompleteAssent {
        require(msg.value == salePrice, "Incorrect payment amount");
    }

    function sellerWithdraw() public sellerOnly preventIncompleteAssent {
        require(fullyPerformed, "Contract must be fully performed before seller withdrawal");
        seller.transfer(address(this).balance);
    }

    function kill() public {
        require(msg.sender == contractOwner, "Only contract owner can kill the contract");
        selfdestruct(address(uint256(contractOwner)));
    }

    modifier sellerOnly() {
        require(msg.sender == seller, "Only seller can perform this action");
        _;
    }

    modifier buyerOrSellerOnly() {
        require(msg.sender == buyer || msg.sender == seller, "Only buyer or seller can perform this action");
        _;
    }

    modifier buyerOnly() {
        require(msg.sender == buyer, "Only buyer can perform this action");
        _;
    }

    modifier preventIncompleteAssent() {
        require(sellerAssent && buyerAssent, "Both seller and buyer must give assent");
        _;
    }

    modifier performanceReviewed() {
        _;
        if (propertyReceived && address(this).balance == salePrice) {
            fullyPerformed = true;
            emit TransactionPerformed();
        }
    }
}

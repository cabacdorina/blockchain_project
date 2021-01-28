pragma solidity >=0.6.0;

import "./ItemManager.sol";
contract Item {
    
    uint public priceInWei;
    uint public index;
    uint public pricePaid;
    
    ItemManager parentContract;
    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) public{
        priceInWei=priceInWei;
        index=_index;
        parentContract=_parentContract;
    }
    
     receive() external payable{
        require(pricePaid==0,"Item is paid already");
        require(priceInWei==pricePaid,"Only full payments allowed");
        pricePaid+=msg.value;
        address add =address(parentContract);
        payable(add).transfer(msg.value);
        //address(parentContract).transfer(msg.value);
        //(bool success, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint)", index));
        //require(success,"The transaction was not successful");  
        //(bool success, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        
    }
    
    
    fallback () external {
    }

    // // constructor() public payable {
    // // owner = msg.sender;
    // //}
    
}

pragma solidity >=0.6.0;

import "./Ownable.sol";
import "./Item.sol";
contract ItemManager is Ownable{
    
    enum SupplyChainState {Created, Paid, Delivered}
    
    struct S_Product{
        Item _item;
        string _identifier;
        uint _DEV;
        uint _REV;
        string _domain;
        string _manager;
        string _description;
        ItemManager.SupplyChainState _state;
        uint _itemPrice;
    }
    
    struct Manager{
         string _name;
         uint _reputation;
    }
    
     struct Finantator{
         string _name;
         uint _reputation;
    }
    
    struct Freelancer{
         string _name;
         uint _reputation;
         string _category;
    }
    
     struct Evaluator{
         string _name;
         uint _reputation;
         string _category;
    }
    
    mapping( uint => S_Product) public items;
    uint itemIndex;
    
    Manager public manager;
    mapping (uint => Finantator) public finantatori;
    uint indexFinantator;
    mapping (uint => Freelancer) public freelancers;
    uint indexFreelancer;
    mapping (uint => Evaluator) public evaluatori;
    uint indexEvaluator;
    
    event SupplyChainStep(uint _itemIndex, uint _step, address _itemAddress);
    //event createdElement(string _elementName,uint _elementIndex);
    function createItem(string memory _identifier, uint _DEV, uint _REV, string memory _domain, string memory _manager, string memory _description) public onlyOwner{
        uint _itemPrice=items[itemIndex]._DEV+items[itemIndex]._REV;
        
        Item item = new Item(this,_itemPrice,itemIndex);
        items[itemIndex]._item=item;
        items[itemIndex]._itemPrice=_itemPrice;
        
        items[itemIndex]._identifier=_identifier;
        items[itemIndex]._DEV=_DEV;
        items[itemIndex]._REV=_REV;
        items[itemIndex]._domain=_domain;
        items[itemIndex]._manager=_manager;
        items[itemIndex]._description=_description;
        items[itemIndex]._state= SupplyChainState.Created;
       
        
        emit SupplyChainStep(itemIndex,uint(items[itemIndex]._state), address(item));
        itemIndex++;
    }
    
    function createManager(string memory _name, uint _reputation) public onlyOwner{
        manager._name=_name;
        require(_reputation>=0 && _reputation<=10, "Reputation must be between 0 and 10");
        manager._reputation=_reputation;
        //emit createdElement(manager._name,0);
    }
    
    function createFinantator(string memory _name, uint _reputation)public onlyOwner{
        finantatori[indexFinantator]._name=_name;
        require(_reputation>=0 && _reputation<=10, "Reputation must be between 0 and 10");
        finantatori[indexFinantator]._reputation=_reputation;
        indexFinantator++;
    }
    
    function createFreelancer(string memory _name, uint _reputation, string memory _category)public onlyOwner{
        freelancers[indexFreelancer]._name=_name;
        require(_reputation>=0 && _reputation<=10, "Reputation must be between 0 and 10");
        freelancers[indexFreelancer]._reputation=_reputation;
        freelancers[indexFreelancer]._category=_category;
        indexFreelancer++;
    }
    
     function createEvaluator(string memory _name, uint _reputation, string memory _category)public onlyOwner{
        evaluatori[indexEvaluator]._name=_name;
        require(_reputation>=0 && _reputation<=10, "Reputation must be between 0 and 10");
        evaluatori[indexEvaluator]._reputation=_reputation;
        evaluatori[indexEvaluator]._category=_category;
        indexEvaluator++;
    }
    
    
    function triggerPayment(uint _itemIndex) public payable onlyOwner{
        require(items[_itemIndex]._itemPrice == msg.value, "Only full payments accepted");
        require(items[_itemIndex]._state == SupplyChainState.Created, "Item is in the chain");
        items[_itemIndex]._state = SupplyChainState.Paid;
        
        emit SupplyChainStep(_itemIndex,uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
    }
    
    function triggerDelivery(uint _itemIndex) public onlyOwner{
        require(items[_itemIndex]._state == SupplyChainState.Paid, "Item is in the chain");
        items[_itemIndex]._state = SupplyChainState.Delivered;
        
        emit SupplyChainStep(_itemIndex,uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
    }
}
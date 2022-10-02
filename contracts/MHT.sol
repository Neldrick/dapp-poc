//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract MHT {
  string public name = "My Trade Token";
  string public symbol = "MHT";
  uint256 public totalFarmerBalance;
  uint256 public totalBuyerBalance;
  uint256 public totalSupply = 1000000;
  // An address type variable is used to store ethereum accounts.
  address public owner;
  struct AddressTypeBalance {
    address seller;
    uint8 riceType;
    uint256 balance;
    uint256 startDate;
    uint256 endDate;
  }
  struct TypeBalance {
     uint8 riceType;
     uint256 balance;
     uint256 startDate;
     uint256 endDate;
  }
  struct SellItem {
    address seller; //request will be buyer, price will be seller
    uint256 size; // how many coin into 1 pack 1,5,10 ,12..
    uint256 amount; // how many pack we have
    uint256 price;
    uint256 startDate;
    uint256 endDate;
  }
  struct BuyItem {
    address buyer;
    address seller; //request will be buyer, price will be seller
    uint256 size; // how many coin into 1 pack 1,5,10 ,12..
    uint256 amount; // how many pack we have
    uint256 price;
    uint256 startDate;
    uint256 endDate;
  }
  struct Item {
    address seller; // , buyerholding will be seller
    uint256 amount; // how many pack we have
    uint8 riceType;
    uint256 price;
    uint256 startDate;
    uint256 endDate; // purchase
  }
  struct SoldItem {
    address buyer; // , buyerholding will be seller
    uint256 amount; // how many pack we have
    uint8 riceType;
    uint256 price;
    uint256 startDate;
    uint256 endDate; // purchase
    uint256 soldTime;
  }
  // A mapping is a key/value map. Here we store each account's balance.
  mapping(address => uint256) balances;
  // unharvest balance for seller to claim 
  mapping(address => TypeBalance[]) unharvestBalance;
  // seller balance  - add-> seller, string -> type , int -> amount
  mapping(address => TypeBalance[]) sellerTypeBalance;
  // seller sold list
  mapping(address => SoldItem[]) sellerSoldBalance;
  // buyer balance  -add -> buyer, string -> type , string -> seller add ,purchase price, amount 
  mapping(address => Item[]) buyerTypeBalance;

  // price list -string -> type, add -> seller , string - size , amount , price
  mapping(uint8 => SellItem[]) priceList;
  // request list - string -> type, add -> seller, string - buyer, price, size, amount
  mapping(uint8 => BuyItem[]) requestList;

  // The Transfer event helps off-chain applications understand
  // what happens within your contract.
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  /**
   * Contract initialization.
   */
  constructor() {
      // The totalSupply is assigned to the transaction sender, which is the
      // account that is deploying the contract.
      balances[msg.sender] = totalSupply;
      owner = msg.sender;
  }
  function transfer(address to, uint256 amount) external {
      // Check if the transaction sender has enough tokens.
      // If `require`'s first argument evaluates to `false` then the
      // transaction will revert.
      require(balances[msg.sender] >= amount, "Not enough tokens");

      // Transfer the amount.
      balances[msg.sender] -= amount;
      balances[to] += amount;

      // Notify off-chain applications of the transfer.
      emit Transfer(msg.sender, to, amount);
  }
  
  function transferFrom(address seller, address buyer, uint256 numTokens) external {

        require(numTokens <= balances[seller]);
        require(seller == owner);
        balances[seller] = balances[seller]-numTokens;

        balances[buyer] = balances[buyer]+numTokens;

        emit Transfer(seller, buyer, numTokens);
  }
  function getUnharvestBalance(address seller)external view returns (TypeBalance [] memory){
    return unharvestBalance[seller];
  }
  function setUnHarvestBalance(AddressTypeBalance []  memory assignedTypeBalance ) external {

        require(msg.sender == owner);
        uint totalRequest = sumTypeBalance(assignedTypeBalance);
        require(balances[msg.sender] >= totalRequest, "Not enough tokens");

        for(uint i = 0 ; i < assignedTypeBalance.length; i++){
          address currentSeller = assignedTypeBalance[i].seller;
          TypeBalance memory newTypeBalance = TypeBalance({riceType: assignedTypeBalance[i].riceType, balance: assignedTypeBalance[i].balance, startDate: assignedTypeBalance[i].startDate, endDate: assignedTypeBalance[i].endDate});
          unharvestBalance[currentSeller].push(newTypeBalance);
          // check sellerTypeBalance exists
          // if(sellerTypeBalance[currentSeller].length > 0){
          //   // find type exists 
          //   bool typeExists = false;
          //   for(uint itemCount; itemCount < sellerTypeBalance[currentSeller].length; itemCount ++){
          //     if(sellerTypeBalance[currentSeller][itemCount].riceType == assignedTypeBalance[i].riceType
          //     && sellerTypeBalance[currentSeller][itemCount].startDate == assignedTypeBalance[i].startDate
          //     && sellerTypeBalance[currentSeller][itemCount].endDate == assignedTypeBalance[i].endDate ){
          //       sellerTypeBalance[currentSeller][itemCount].balance += assignedTypeBalance[i].balance;
          //       typeExists = true;
          //       break;
          //     }
          //   }
          //   if(!typeExists){
          //     TypeBalance memory newTypeBalance = TypeBalance({riceType: assignedTypeBalance[i].riceType, balance: assignedTypeBalance[i].balance, startDate: assignedTypeBalance[i].startDate, endDate: assignedTypeBalance[i].endDate});
          //     sellerTypeBalance[currentSeller].push(newTypeBalance);
          //   }
            
          // }else{
          //   // push to sellerHolding
          //   TypeBalance memory newTypeBalance = TypeBalance({riceType: assignedTypeBalance[i].riceType, balance: assignedTypeBalance[i].balance, startDate: assignedTypeBalance[i].startDate, endDate: assignedTypeBalance[i].endDate});
          //   sellerTypeBalance[currentSeller].push(newTypeBalance);
          // }
          // balances[msg.sender] -= assignedTypeBalance[i].balance;
          // balances[currentSeller] += assignedTypeBalance[i].balance;
          // totalFarmerBalance += assignedTypeBalance[i].balance;
          // emit Transfer(msg.sender, currentSeller, assignedTypeBalance[i].balance);
        }
  }
  function harvest(address seller, TypeBalance memory unharvestItem) external {
    require(msg.sender == seller);
    uint itemIndex;
    bool indexFound = false;
    for(uint i; i< unharvestBalance[seller].length; i++){
      if(unharvestBalance[seller][i].riceType == unharvestItem.riceType
        && unharvestBalance[seller][i].startDate == unharvestItem.startDate
        && unharvestBalance[seller][i].endDate == unharvestItem.endDate
        && unharvestBalance[seller][i].balance == unharvestItem.balance ){
          itemIndex = i;
          indexFound = true;
          break;
        }
    }
    require(indexFound, "UnHarvest item not found");
    // to delete -> copy last item to index and delete + length --
    unharvestBalance[seller][itemIndex] = unharvestBalance[seller][unharvestBalance[seller].length -1];
    unharvestBalance[seller].pop();
    if(sellerTypeBalance[seller].length > 0){
      // find type exists 
      bool typeExists = false;
      for(uint itemCount; itemCount < sellerTypeBalance[seller].length; itemCount ++){
        if(sellerTypeBalance[seller][itemCount].riceType == unharvestItem.riceType
        && sellerTypeBalance[seller][itemCount].startDate == unharvestItem.startDate
        && sellerTypeBalance[seller][itemCount].endDate == unharvestItem.endDate ){
          sellerTypeBalance[seller][itemCount].balance += unharvestItem.balance;
          typeExists = true;
          break;
        }
      }
      if(!typeExists){
        TypeBalance memory newTypeBalance = TypeBalance({riceType: unharvestItem.riceType, balance: unharvestItem.balance, startDate: unharvestItem.startDate, endDate: unharvestItem.endDate});
        sellerTypeBalance[seller].push(newTypeBalance);
      }
      
    }else{
      // push to sellerHolding
      TypeBalance memory newTypeBalance = TypeBalance({riceType: unharvestItem.riceType, balance: unharvestItem.balance, startDate: unharvestItem.startDate, endDate: unharvestItem.endDate});
      sellerTypeBalance[seller].push(newTypeBalance);
    }

    balances[owner] -= unharvestItem.balance;
    balances[seller] += unharvestItem.balance;
    totalFarmerBalance += unharvestItem.balance;
    emit Transfer(owner, seller, unharvestItem.balance);
        
  }
  function sumTypeBalance (AddressTypeBalance [] memory balanceList)private pure returns (uint retVal){
        uint totalAmnt = 0;
        
        for (uint i=0; i < balanceList.length; i++) {
            totalAmnt += balanceList[i].balance;
        }
        return totalAmnt;
  }
  /**
   * Read only function to retrieve the token balance of a given account.
   *
   * The `view` modifier indicates that it doesn't modify the contract's
   * state, which allows us to call it without executing a transaction.
   */
  function balanceOf(address account) external view returns (uint256) {
      return balances[account];
  }

  function getTotalSupply() external view returns (uint256) {
    return totalSupply;
  }
  function getTotalFarmerBalance () external view returns (uint256) {
      return totalFarmerBalance;
  }
  function getTotalBuyerBalance () external view returns (uint256) {
      return totalBuyerBalance;
  }
  // farmer balance
  function getSellerTypeBalance (address seller) external view returns (TypeBalance[] memory){
      return sellerTypeBalance[seller];
  }
  // farmer sold list
  function getSellerSoldList(address seller) external view returns (SoldItem[] memory){
    return sellerSoldBalance[seller];
  }
  // buyer balance
  function getBuyerBalance (address buyer) external view returns (Item[] memory){
    return buyerTypeBalance[buyer];
  }
  function getPriceListBySellerType(address seller, uint8 riceType) external view returns (SellItem[] memory){
      uint256 resultCount;
      for(uint i = 0; i < priceList[riceType].length; i ++){
        if(priceList[riceType][i].seller == seller){
          resultCount++;
        }
      }
      SellItem [] memory sellerPriceList = new SellItem [](resultCount);
      uint256 j = 0;
      for(uint i = 0; i < priceList[riceType].length; i ++){
        if(priceList[riceType][i].seller == seller){
           sellerPriceList[j]=priceList[riceType][i];
           j++;
        }
      }
      return sellerPriceList;
  }
  function getPriceListByType(uint8 riceType) external view returns (SellItem[] memory){
    return priceList[riceType];
  }
  function getSellerRequestListByType(address seller, uint8 riceType) external view returns (BuyItem[] memory){
      uint256 resultCount;
      for(uint i = 0; i < requestList[riceType].length; i ++){
        if(requestList[riceType][i].seller == seller){
          resultCount++;
        }
      }
      BuyItem [] memory requestPriceList = new BuyItem [](resultCount);
      uint256 j = 0;
      for(uint i = 0; i < requestList[riceType].length; i ++){
        if(requestList[riceType][i].seller == seller){
           requestPriceList[j]=requestList[riceType][i];
           j++;
        }
      }
      return requestPriceList;
  } 
  
  function getBuyerRequestListByType(address buyer, uint8 riceType) external view returns (BuyItem[] memory){
      uint256 resultCount;
      for(uint i = 0; i < requestList[riceType].length; i ++){
        if(requestList[riceType][i].buyer == buyer){
          resultCount++;
        }
      }
      BuyItem [] memory requestPriceList = new BuyItem [](resultCount);
      uint256 j = 0;
      for(uint i = 0; i < requestList[riceType].length; i ++){
        if(requestList[riceType][i].buyer == buyer){
           requestPriceList[j]=requestList[riceType][i];
           j++;
        }
      }
      return requestPriceList;
  } 
  function isAddressSeller(address userAdd) external view returns (bool){
    if(sellerTypeBalance[userAdd].length > 0 || unharvestBalance[userAdd].length > 0){
      return true;
    }
    return false;
  }
  function createPriceItemForAHolding(uint8 riceType, SellItem[] memory newItemList) external {
    // check amount enough in seller holding(balance_)  + price list 
   
    // get holding with same type start date
    uint holdingAmount;
    uint listedAmount;
    uint newPriceListAmount;
    for(uint i = 0; i < sellerTypeBalance[newItemList[0].seller].length; i++){
      if(sellerTypeBalance[newItemList[0].seller][i].riceType == riceType
      && sellerTypeBalance[newItemList[0].seller][i].startDate == newItemList[0].startDate
      && sellerTypeBalance[newItemList[0].seller][i].endDate == newItemList[0].endDate
      ){
        holdingAmount = sellerTypeBalance[newItemList[0].seller][i].balance;
        break;
      }
    } 
    for(uint i = 0 ; i < priceList[riceType].length ; i++){
      if(priceList[riceType][i].seller == newItemList[0].seller
      && priceList[riceType][i].startDate == newItemList[0].startDate
      && priceList[riceType][i].endDate == newItemList[0].endDate
      ){
        listedAmount += (priceList[riceType][i].amount * priceList[riceType][i].size);
      }
    }
    for(uint i = 0 ; i < newItemList.length; i++){
      newPriceListAmount += (newItemList[i].amount * newItemList[i].size);
    }
    require((listedAmount + newPriceListAmount) <= holdingAmount, "Balance not enough");
    // create item and set it to price list
    for(uint i = 0 ; i < newItemList.length; i++){
      priceList[riceType].push(newItemList[i]); 
    }
  }
  function createRequest(uint8 riceType, BuyItem[] memory newItemList) external {
    // check amount enough in seller holding(balance_)  + price list 
    // create item and set it to price list
    for(uint i = 0 ; i < newItemList.length; i++){
      requestList[riceType].push(newItemList[i]); 
    }
  }
  function sendItemToBuyer(uint8 riceType, BuyItem memory newItemList)external {
    // check have enough amount 
    // find the item 
    TypeBalance memory balance;
    for(uint i = 0; i < sellerTypeBalance[newItemList.seller].length; i++){
      if(sellerTypeBalance[newItemList.seller][i].riceType == riceType
      && sellerTypeBalance[newItemList.seller][i].startDate == newItemList.startDate
      && sellerTypeBalance[newItemList.seller][i].endDate == newItemList.endDate
      ){
        balance = sellerTypeBalance[newItemList.seller][i];
        break;
      }
    } 
    // find price Item 
    // TODO: incorrect search , change to single item or put it in loop
    SellItem memory priceItem;
    uint priceItemIndex;
    for(uint i = 0 ; i < priceList[riceType].length ; i++){
      if(priceList[riceType][i].seller == newItemList.seller
      && priceList[riceType][i].startDate == newItemList.startDate
      && priceList[riceType][i].endDate == newItemList.endDate
      && priceList[riceType][i].price == newItemList.price
      && priceList[riceType][i].size == newItemList.size
      ){
        priceItem = priceList[riceType][i];
        priceItemIndex = i;
        break;
      }
    }
    // check total amount of buy item > priceItem or not
    uint totalBuyAmount = newItemList.amount * newItemList.size;
    
    require(totalBuyAmount <= (priceItem.amount * priceItem.size), "Sell Item not enough");
    require(totalBuyAmount <= balance.balance, "Balance not enough");
    
    
    // reduce amount from price and balance
    priceItem.amount -= newItemList.amount;
    balance.balance -= totalBuyAmount;
    // add item to buyer
    Item memory newItem = Item({
      seller: newItemList.seller, amount: newItemList.amount,
      riceType: riceType, price: newItemList.price,
      startDate: newItemList.startDate, endDate: newItemList.endDate
    });
    buyerTypeBalance[newItemList.buyer].push(newItem);
    // add sold list
    SoldItem memory soldItem = SoldItem({
      buyer: newItemList.buyer, amount: totalBuyAmount,
      riceType: riceType, price: newItemList.price,
      startDate: newItemList.startDate, endDate: newItemList.endDate,
      soldTime: block.timestamp
    });
    sellerSoldBalance[newItemList.seller].push(soldItem);
    // remove item from request list
    uint requestIndex;
    for(uint m; m < requestList[riceType].length; m ++){
      if(requestList[riceType][m].buyer == newItemList.buyer
      && requestList[riceType][m].seller == newItemList.seller
      && requestList[riceType][m].size == newItemList.size
      && requestList[riceType][m].amount == newItemList.amount
      && requestList[riceType][m].price == newItemList.price
      && requestList[riceType][m].startDate == newItemList.startDate
      && requestList[riceType][m].endDate == newItemList.endDate
      ){
        requestIndex = m;
        break;
      }
    }
    requestList[riceType][requestIndex] = requestList[riceType][requestList[riceType].length - 1];
    requestList[riceType].pop();
    if(priceItem.amount == 0){
      priceList[riceType][priceItemIndex] = priceList[riceType][priceList[riceType].length -1];
      priceList[riceType].pop();
      // TODO: remove all item  from request list
    }else{
      priceList[riceType][priceItemIndex] = priceItem;
    }
    // update balance in hold list
    uint holdingIndex;
    for( uint k=0; k < sellerTypeBalance[newItemList.seller].length; k++){
      if(sellerTypeBalance[newItemList.seller][k].riceType == riceType
      && sellerTypeBalance[newItemList.seller][k].startDate == newItemList.startDate
      && sellerTypeBalance[newItemList.seller][k].endDate == newItemList.endDate){
        sellerTypeBalance[newItemList.seller][k].balance -= totalBuyAmount;
        holdingIndex= k;
        break;
      }
    }
    if(sellerTypeBalance[newItemList.seller][holdingIndex].balance == 0){
      sellerTypeBalance[newItemList.seller][holdingIndex] = sellerTypeBalance[newItemList.seller][sellerTypeBalance[newItemList.seller].length - 1];
      sellerTypeBalance[newItemList.seller].pop();
    }
    // transfer coin
    
    balances[newItemList.seller] -= totalBuyAmount;
    balances[newItemList.buyer] += totalBuyAmount;
    totalFarmerBalance -= totalBuyAmount;
    totalBuyerBalance += totalBuyAmount;
    emit Transfer(newItemList.seller, newItemList.buyer, totalBuyAmount);
    
    
  }
}
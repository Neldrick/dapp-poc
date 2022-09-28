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
  struct addressTypeBalance {
    address seller;
    uint8 riceType;
    uint256 balance;
    uint256 startDate;
    uint256 endDate;
  }
  struct typeBalance {
     uint8 riceType;
     uint256 balance;
     uint256 startDate;
     uint256 endDate;
  }
  struct sellItem {
    address toBeOwner; //request will be buyer, price will be seller
    uint256 size; // how many coin into 1 pack 1,5,10 ,12..
    uint256 amount; // how many pack we have
    uint256 price;
    uint256 startDate;
    uint256 endDate;
  }
  struct item {
    address seller; // , buyerholding will be seller
    uint256 amount; // how many pack we have
    uint8 riceType;
    uint256 price;
    uint256 startDate;
    uint256 endDate; // purchase
  }
  // A mapping is a key/value map. Here we store each account's balance.
  mapping(address => uint256) balances;
  // seller balance  - add-> seller, string -> type , int -> amount
  mapping(address => typeBalance[]) sellerTypeBalance;
  
  // buyer balance  -add -> buyer, string -> type , string -> seller add ,purchase price, amount 
  mapping(address => item[]) buyerTypeBalance;

  // price list -string -> type, add -> seller , string - size , amount , price
  mapping(uint8 => sellItem[]) priceList;
  // request list - string -> type, add -> seller, string - buyer, price, size, amount
  mapping(uint8 => mapping(address => sellItem[])) requestList;

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

  function issueToSeller(addressTypeBalance []  memory assignedTypeBalance ) external {

        require(msg.sender == owner);
        uint totalRequest = sumTypeBalance(assignedTypeBalance);
        require(balances[msg.sender] >= totalRequest, "Not enough tokens");

        for(uint i = 0 ; i < assignedTypeBalance.length; i++){
          address currentSeller = assignedTypeBalance[i].seller;
          // check sellerTypeBalance exists
          if(sellerTypeBalance[currentSeller].length > 0){
            // find type exists 
            bool typeExists = false;
            for(uint itemCount; itemCount < sellerTypeBalance[currentSeller].length; itemCount ++){
              if(sellerTypeBalance[currentSeller][itemCount].riceType == assignedTypeBalance[i].riceType
              && sellerTypeBalance[currentSeller][itemCount].startDate == assignedTypeBalance[i].startDate
              && sellerTypeBalance[currentSeller][itemCount].endDate == assignedTypeBalance[i].endDate ){
                sellerTypeBalance[currentSeller][itemCount].balance += assignedTypeBalance[i].balance;
                typeExists = true;
                break;
              }
            }
            if(!typeExists){
              typeBalance memory newTypeBalance = typeBalance({riceType: assignedTypeBalance[i].riceType, balance: assignedTypeBalance[i].balance, startDate: assignedTypeBalance[i].startDate, endDate: assignedTypeBalance[i].endDate});
              sellerTypeBalance[currentSeller].push(newTypeBalance);
            }
            
          }else{
            // push to sellerHolding
            typeBalance memory newTypeBalance = typeBalance({riceType: assignedTypeBalance[i].riceType, balance: assignedTypeBalance[i].balance, startDate: assignedTypeBalance[i].startDate, endDate: assignedTypeBalance[i].endDate});
            sellerTypeBalance[currentSeller].push(newTypeBalance);
          }
          balances[msg.sender] -= assignedTypeBalance[i].balance;
          balances[currentSeller] += assignedTypeBalance[i].balance;
          totalFarmerBalance += assignedTypeBalance[i].balance;
          emit Transfer(msg.sender, currentSeller, assignedTypeBalance[i].balance);
        }
  }

  function sumTypeBalance (addressTypeBalance [] memory balanceList)private pure returns (uint retVal){
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
  function isAddressSeller(address userAdd) external view returns (bool){
    if(sellerTypeBalance[userAdd].length > 0){
      return true;
    }
    return false;
  }
}
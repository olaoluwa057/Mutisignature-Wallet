// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.2 <0.8.0;
//pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract MultiSigWallet is ReentrancyGuard{
    //define a struct- Transaction
    struct Transaction{
        address txSender;
        address payable destination;
        uint amount;
        bool isExecuted;
        uint noOfConfirmations;
        uint txId;
        bytes data;
         
    }
    bool isActive = true;
    function toggleCircuitBreaker() external onlyOwner contractIsActive() {
        isActive = !isActive;
    }
    modifier contractIsActive(){
        require(isActive = true);
        _;
    }
    //array of addres ownrs in Remix js VM for deployment ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"], 2
    //array of address owners from metamask for deployment ["0x0d6589Fcf3b02b5723c6DDb47756382d865f3Af5", "0x61844cD4148A53321194a9a50Ef97Fb0D4364C3A", "0x51520526F6aB6fE5658782F4D5C742Cd020b143f"], 2
    Transaction[] public transactions;//all or pending transactions
    Transaction[] public successfulTransactions;//successfulTransactions
    Transaction[] public revokedTransactions;//successfulTransactions
    address[]public owners;
    mapping(address => bool)public isOwner;
    uint public requiredConfirmations;
    
    mapping(uint => mapping(address => bool)) public isApproved;
    constructor(address[] memory _owners, uint _requiredConfirmations)public {
        require(_owners.length > 1, 'Its a multi-Signature wallet, you need more than one owners');
        require(_requiredConfirmations > 1 && _requiredConfirmations <= _owners.length);
        for(uint i; i < _owners.length; i++){
            address _owner = _owners[i];
            require(_owner != address(0), "This is not a valid owner");
            require(!isOwner[_owner], "owner not unique");
            isOwner[_owner] = true;
            owners.push(_owner);
        }
        requiredConfirmations = _requiredConfirmations;
    }
    //fallback function to recieve ether
    fallback() payable external {
        emit deposit2Contract(msg.sender, msg.value, address(this).balance);
    }
    function deposit () payable external {
        emit deposit2Contract(msg.sender, msg.value, address(this).balance);
    }
    //function to check contract balance
    function checkBalance() public view returns(uint256){
        return address(this).balance;
    }
    //events
    //event for TransactionProposed
    event TransactionProposed(address indexed owner, address indexed destination, uint amount,uint transactionId);
    //event for TransactionApproved
    event TransactionApproved(address indexed owner,uint transactionId);
    //event for execution
    event ExecutedTransaction(address indexed owner,uint transactionId);
    //event for rejected transaction
    event rejectedTransaction(address indexed owner,uint transactionId);
    //event for fallback
    event contractFallback(address indexed sender, uint amount, uint balance);
    //deposit event
    event deposit2Contract(address indexed sender, uint amount, uint balance);
    // mmodifier to check if caller is part of owners
    modifier onlyOwner(){
        require(isOwner[msg.sender], 'You are not part of owners');
        _;
    }
    //modifier to check if Transaction Exist
    modifier transactionExist(uint _transactionId){
        require(_transactionId >= 0 && _transactionId <= transactions.length,"not within transaction range" );
        _;
    }
    //mmodifier to check if transaction is not yet notApprovedYet
    modifier notApprovedYet(uint _transactionId){
        require(!isApproved[_transactionId][msg.sender] ,"You cant approve a transaction more than once");
        _;
    }
    //modifier to check that transaction is not executed yet
    modifier notExecutedYet(uint _transactionId){
        require(!transactions[_transactionId].isExecuted, "Transaction already executed");
        _;
    }
    //FUNCTIONS
    function viewOwners() public view returns(address[]memory){
        return owners;
    }
    
    //function to view  pending transactions
    function viewTransactions() external view returns(address[]memory,address[]memory,uint[]memory,uint[]memory, uint[]memory){
        address[]memory txSenders = new address[](transactions.length);
        address[]memory destinations = new address[](transactions.length);
        uint[]memory amounts = new uint[](transactions.length);
        uint[]memory noOfConfirmationss = new uint[](transactions.length);
        uint[]memory txIds = new uint[](transactions.length);
        
        for(uint i = 0; i< transactions.length; i++){
            txSenders[i] = transactions[i].txSender;
            destinations[i] = transactions[i].destination;
            amounts[i] = transactions[i].amount;
            noOfConfirmationss[i] = transactions[i].noOfConfirmations;
            txIds[i] = transactions[i].txId;
            
        }
        
        return(txSenders,destinations, amounts, noOfConfirmationss,txIds);
    } 
    
    //function to view successfulTransactions
    function viewSuccessfulTransactions()public view returns(address[]memory,address[]memory,uint[]memory,uint[]memory, uint[]memory){
        address[]memory txSenders = new address[](successfulTransactions.length);
        address[]memory destinations = new address[](successfulTransactions.length);
        uint[]memory amounts = new uint[](successfulTransactions.length);
        uint[]memory noOfConfirmationss = new uint[](successfulTransactions.length);
        uint[]memory txIds = new uint[](successfulTransactions.length);
        
        for(uint i = 0; i< successfulTransactions.length; i++){
            txSenders[i] = successfulTransactions[i].txSender;
            destinations[i] = successfulTransactions[i].destination;
            amounts[i] = successfulTransactions[i].amount;
            noOfConfirmationss[i] = successfulTransactions[i].noOfConfirmations;
            txIds[i] = successfulTransactions[i].txId;
            
        }
        
        return(txSenders,destinations, amounts, noOfConfirmationss,txIds);
    } 
    
    //function to view revokedTransactions
    function viewFailedTransactions()public view returns(address[]memory,address[]memory,uint[]memory,uint[]memory,uint[]memory){
        address[]memory txSenders = new address[](revokedTransactions.length);
        address[]memory destinations = new address[](revokedTransactions.length);
        uint[]memory amounts = new uint[](revokedTransactions.length);
        uint[]memory noOfConfirmationss = new uint[](revokedTransactions.length);
        uint[]memory txIds = new uint[](revokedTransactions.length);
        
        for(uint i = 0; i< revokedTransactions.length; i++){
            txSenders[i] = revokedTransactions[i].txSender;
            destinations[i] = revokedTransactions[i].destination;
            amounts[i] = revokedTransactions[i].amount;
            noOfConfirmationss[i] = revokedTransactions[i].noOfConfirmations;
            txIds[i] = revokedTransactions[i].txId;
            
        }
        
        return(txSenders,destinations, amounts, noOfConfirmationss,txIds);
    } 
    //propose or submit a transaction
    function proposeTransaction(address payable _destination, uint _amount, bytes memory _data)
    public
    onlyOwner
    {
        uint _transactionId = transactions.length;
        transactions.push(Transaction({
            txSender: msg.sender,
            destination: _destination,
            amount: _amount,
            isExecuted: false,
            noOfConfirmations: 0,
            txId: _transactionId,
            data: _data
        }));
        emit TransactionProposed(msg.sender, _destination, _amount, _transactionId);
    }
    //approve transaction for execution
   /* function approveTransaction(uint _transactionId)
    public
    onlyOwner
    transactionExist(_transactionId)
    notExecutedYet(_transactionId)
    notApprovedYet(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.isApproved[msg.sender] = true;
        transaction.noOfConfirmations++;
        emit TransactionApproved(msg.sender, _transactionId);
    } */

    function approveTransaction(uint _transactionId)
        public
        onlyOwner
        transactionExist(_transactionId)
        notExecutedYet(_transactionId)
       // notApprovedYet(_transactionId)
    {
         Transaction storage transaction = transactions[_transactionId];

        transaction.noOfConfirmations++;
         isApproved[_transactionId][msg.sender] = true;

        emit TransactionApproved(msg.sender, _transactionId);
        
    }
    //execute transaction
    function executeTransaction(uint _transactionId)public onlyOwner transactionExist(_transactionId) notApprovedYet( _transactionId)  notExecutedYet(_transactionId) nonReentrant() contractIsActive(){
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.noOfConfirmations >= requiredConfirmations,
            "cannot Execute Transaction-Invalid Number of Confirmations"
        ); 
        transaction.isExecuted = true;
       // (bool success,) = transaction.destination.call{value: transaction.amount}(transaction.data);
        transaction.destination.transfer(transaction.amount);
        //push transaction to list of successful transactions
        successfulTransactions.push(transaction);
        //remove transactions from list of pending transactions
            for(uint i = _transactionId; i < transactions.length-1; i++){
            transactions[i] = transactions[i + 1];
        }
        transactions.pop();
        //emit ExecutedTransaction event
        emit ExecutedTransaction(msg.sender, _transactionId);
        
    }
   



    //function to revoke transaction
    function rejectTransaction(uint _transactionId)public onlyOwner transactionExist(_transactionId) notExecutedYet(_transactionId) {
        Transaction storage transaction = transactions[_transactionId];
        require(isApproved[_transactionId][msg.sender], "Transaction not Approved");

        transaction.noOfConfirmations -= 1;
        isApproved[_transactionId][msg.sender] = false;
          revokedTransactions.push(transaction);
        //remove transactions from list of transactions
        
            for(uint i = _transactionId; i < transactions.length-1; i++){
            transactions[i] = transactions[i + 1];
        }
        transactions.pop();
        
         emit rejectedTransaction(msg.sender, _transactionId);
    }
    
    
}

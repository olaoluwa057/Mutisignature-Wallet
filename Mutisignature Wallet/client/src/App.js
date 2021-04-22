import React, { Component } from "react";
import DashBoard from './components/DashBoard';
import Landing from './components/Landing';

import MultiSigWallet from "./contracts/MultiSigWallet.json";
import getWeb3 from "./getWeb3";
import "./App.css";


class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    contractAddress: null,
    isContractAddress: 'not yet',
    contractABI: null,
    beforeDeployedInstance: null,
    contractByteCode: null,
    currentAccount: null,
    ownersArray: [],
    confirmations: null,
    contractBalance: '',
    pendingTx: [],
    executedTx: [],
    revokedTx:[],
    currentComponent: 'dashboard',
    circuitBreaker: true
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      this.setState({
        web3
      })

     

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
    
      const currentAccount = await web3.currentProvider.selectedAddress;
      this.setState({
        currentAccount
      })

    
     


   /*   if(localStorage.length !== 0){
        this.setUserWallet();

      } */

        
    //  console.log(deployerAccount, 'deployer account');
      
      const contractABI = MultiSigWallet.abi;
      const contractByteCode = MultiSigWallet.bytecode;
      
      
      const beforeDeployedInstance = new web3.eth.Contract(
        contractABI
      );

      

      

      this.setState({
        contractABI
      })

      // TO BE REMOVED
     const contractAddress = "0xBb37ae140936052b3F6907bad61cdEa47557D151";
      
      this.setState({
        contractAddress
      }) 

      const contract = new web3.eth.Contract(this.state.contractABI, this.state.contractAddress);
      this.setState({
        contract
      },
      this.contractBalanceHandler)

      //arrays of owners=> addresses from metamask
      const ownersArray = ["0x8B65121355e24943f1EE7cD9FdeB87b272527C4f", "0xC19795F48766EAfb68537690c6Eaa08E0884c64b", "0xB94737b1144667335A29c9C723245925aC3609bd"];
      this.setState({
        ownersArray
      })
      const confirmations = "2"
      this.setState({
        confirmations
      })

  
     // console.log(this.state.ownersArray, this.state.confirmations)
      //END OF PORTION TO BE SAVED

      this.setState({
        beforeDeployedInstance
      })
      

      this.setState({
        contractByteCode
      }) 
    
     //this.deployContract(ownersArray, confirmations);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  

//RETRIEVE USERWALLET SAVED IN LOCAL STORAGE
 /* setUserWallet = ()=> {
    let localStorageAddress;
    let localStorageComponent;
    let contractInstance;
    let parsedInstance;

    if(localStorage){
       localStorageAddress = localStorage.getItem('address');
       localStorageComponent = localStorage.getItem('component');
       contractInstance = localStorage.getItem('contractInstance');
       parsedInstance = JSON.parse(contractInstance);




       this.setState({
        contractAddress: localStorageAddress,
        currentComponent: localStorageComponent,
        contract: parsedInstance
      })

    }

    
    
    console.log(this.state.contractAddress, this.state.currentComponent,this.state.contract, 'localStorage details')
  } */
  //deploy contract function
  deployContract = async (ownersArray, confirmations)=>{
    this.setState({
      ownersArray,
      confirmations
    })

    //deploy contract with constructor parameters
     const deployedContractReciept = await this.state.beforeDeployedInstance.deploy({
        data: this.state.contractByteCode,
        arguments:[ownersArray, confirmations]
      })
      .send({
        from: this.state.currentAccount,
        gas: 7000000,
        gasPrice: 0
      }) 

      //get address of contract, save in state to output in dashboard and create contract instance
      this.setState({
        contractAddress: deployedContractReciept._address,
        isContractAddress: 'yes'
      })

      console.log(this.state.contractAddress);



      

      

      //console.log(deployedContractReciept._address, 'contract address'); 
      //0xc6927A5dbaCAE3A1D38E7edA0aa6aAc8F68c20e1

       //create contract instance
    const contract = new this.state.web3.eth.Contract(this.state.contractABI, this.state.contractAddress);

    this.setState({
      contract
    }) 


    //SAVE CONTRACT DETAILS TO LOCAL STORAGE

  /*  const currentAdd = this.state.contractAddress;
    const currentcomp = this.state.currentComponent;
    const currentContractInstance = this.state.contract;
    const stringedContract = JSON.stringify(currentContractInstance);


    
    localStorage.setItem('address', currentAdd)
    localStorage.setItem('component', currentcomp)
    localStorage.setItem('contractInstance', stringedContract);

  
    
    console.log(localStorage); */
  }

  //check contract balance
  contractBalanceHandler=async()=> {
    const balance = await this.state.contract.methods.checkBalance().call({
      from: this.state.currentAccount
    })
    const contractBalance = await this.state.web3.utils.fromWei(balance, "ether");
    this.setState({
      contractBalance
    })
    
  }

  

   PendingTransactionsList = async(e)=> {
     const pendingTx = await this.state.contract.methods.viewTransactions().call();
     this.setState({
       pendingTx
     })
     
     
   }

   executedTransactionsList = async(e)=> {
    const executedTx = await this.state.contract.methods.viewSuccessfulTransactions().call();
    this.setState({
      executedTx
    })
 
   }

   revokedTransactionsList = async(e)=> {
    const revokedTx = await this.state.contract.methods.viewFailedTransactions().call();
    this.setState({
      revokedTx
    })

    console.log('revoked', this.state.revokedTx)

   }




//functions to call to approve, execute or revoke transactions

   //function to propose transaction

  proposeTransactionHandler= async(recipientAddress, amount)=> {
    const convertedAmount = await this.state.web3.utils.toWei(amount.toString(), "ether");
   // const convertedAmount = await this.state.web3.utils.fromWei(convertedAmount1, "ether");
    console.log(convertedAmount, "C.A");
   // console.log(convertedAmount1, "C.A1");
    
     await this.state.contract.methods.proposeTransaction(
      recipientAddress, convertedAmount, '0x00'
    ).send({
      from: this.state.currentAccount
    })
    
    
  }

  //to approve transaction
   approveTransaction = async(txId)=> {
    
     await this.state.contract.methods.approveTransaction(txId).send({
      from: this.state.currentAccount,
      gas: 70000,
      
     });

     alert('one Confirmation added');
   }

   executeTransaction = async(txId)=> {
     try{
      await this.state.contract.methods.executeTransaction(txId).send({
        from: this.state.currentAccount,
        gas: 1000000,
        gasPrice: 0
       });
   
       alert('Transaction Executed, check Executed Tab');

     }
     catch(error){
       console.log('error', error)
     }
    
    
  }

  revokeTransaction = async(txId)=> {
    
    await this.state.contract.methods.rejectTransaction(txId).send({
     from: this.state.currentAccount
    });

    alert('Transaction Revoked, check RevokedTx Tab');
  }

  changeCurrentComponent = (e)=> {
    this.setState({
      currentComponent:'dashboard'
    })    
  }
  
  freezeTxExecution = async()=> {

    try{
      await this.state.contract.methods.toggleCircuitBreaker().send({
        from:this.state.currentAccount
      })

      this.setState({
        circuitBreaker: !this.state.circuitBreaker
      })
      alert("You have toggled Freeze-Executiom")

      console.log(this.state.circuitBreaker, "toggled");

    }catch(e){
      console.log("error");
    }
    
  }

  //0x8B65121355e24943f1EE7cD9FdeB87b272527C4f 0xC19795F48766EAfb68537690c6Eaa08E0884c64b 0xB94737b1144667335A29c9C723245925aC3609bd

  render() {
   
    let currentComponent;
    if(this.state.currentComponent === 'landing'){
      currentComponent = <Landing  deployContract={this.deployContract}
                          changeCurrentComponent={this.changeCurrentComponent}/>
    }else{
      currentComponent =  <DashBoard 
      ownersArray={this.state.ownersArray}
      confirmations={this.state.confirmations}
      contractAddress={this.state.contractAddress}
      contractBalance={this.state.contractBalance}
      proposeTransaction={this.proposeTransactionHandler}
      pendingTx={this.state.pendingTx}
      pendingTxFunction={this.PendingTransactionsList}
      executedList={this.state.executedTx}
      viewExecutedList={this.executedTransactionsList}
      revokedList={this.state.revokedTx}
      viewRevokedList={this.revokedTransactionsList}
      approveTx={this.approveTransaction}
      executeTx={this.executeTransaction}
      revokeTx={this.revokeTransaction}
      freezeTxExecution={this.freezeTxExecution}/>
    }
    // 
    return (
      <div className="App">
       
        {currentComponent}  
      </div>
    );
  }
}

export default App;


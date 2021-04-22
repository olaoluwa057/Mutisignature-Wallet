import React, { Component } from "react";
import BoardHome from './BoardHome';
import TransactionsPage from './TransactionsPage';
import classNames from 'classnames';


import "../App.css";

class DashBoard extends Component {
  state = {  
      currentContent: 'dashHome'

  };


  pendingTxFunction=async (e)=> {
    await this.props.pendingTxFunction(e);
  }
  


  render() {
    let currentContent;
    //conditionally display component
    if(this.state.currentContent === 'dashHome'){
      currentContent = <BoardHome 
      ownersArray={this.props.ownersArray}
      confirmations={this.props.confirmations}
      proposeTransaction={this.props.proposeTransaction}/>
    }
    else{
      currentContent = <TransactionsPage 
      pendingTx={this.props.pendingTx}
      approveTx={this.props.approveTx}
      executeTx={this.props.executeTx}
      revokeTx={this.props.revokeTx}
      revokedList={this.props.revokedList}
      viewExecutedList={this.props.viewExecutedList}
      viewRevokedList={this.props.viewRevokedList}
      executedList={this.props.executedList}/>
    }

    //conditionally increase icon-size
    const homeIcon = classNames('nav-icon',{
      'active-icon': this.state.currentContent === 'dashHome'
    })
    const txIcon = classNames('nav-icon', {
      'active-icon': this.state.currentContent === 'txPage'
    })
    
   
    return (
      <div className="dashboard">
        <nav className="top-nav">
          <button
          onClick={this.props.freezeTxExecution}> Freeze TX Execution</button>
        <span className="balance-span">Balance: <span className="balance">{this.props.contractBalance} Ether</span></span>
        <span className="contractAddress-span">Wallet address: <span className="contractAddress">{this.props.contractAddress} </span></span>
      
        </nav>
          <nav className="sideNav">
              <div className="nav-images">
                <img onClick={()=> {
                  this.setState({
                    currentContent: 'dashHome'
                  })
                }} 
                className={homeIcon} 
                src="https://i.pinimg.com/736x/79/2f/cc/792fcc12059f306f12ce47b020454692.jpg"/>
                <img onClick={(e)=> {
                  this.setState({
                    currentContent:'txPage'
                  })
                  this.pendingTxFunction(e);
                }}
                className={txIcon} 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz-0MFn6-4wxJSX_xTRmfzpln7Wn_N6dE4Fw&usqp=CAU"/>
            </div>
          </nav>

          
        {currentContent}
          
        
        
      </div>
    );
  }
}

export default DashBoard;

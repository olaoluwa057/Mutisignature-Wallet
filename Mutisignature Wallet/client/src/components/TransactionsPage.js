import React, { Component } from "react";
import SuccessfulTx from './SuccesfulTx';
import PendingTx from './PendingTx';
import RevokedTx from './RevokedTx';
import classNames from 'classnames';

import "../App.css";

class TransactionsPage extends Component {
  state = { 
    currentContent: 'pending'
   };


  render() {
    let content;
    if(this.state.currentContent === 'pending'){
      content = <PendingTx 
      pendingTx={this.props.pendingTx}
      approveTx={this.props.approveTx}
      executeTx={this.props.executeTx}
      revokeTx={this.props.revokeTx}/>
    }
    else if(this.state.currentContent === 'success') {
      content = <SuccessfulTx 
      executedList={this.props.executedList}/>
    }
    else{
      content = <RevokedTx 
      revokedList={this.props.revokedList}/>
    }

    //styling button conditionally 
    const pendingbtn = classNames('switchBtn',{
      'txbtn-active': this.state.currentContent === 'pending'
    })
    const successbtn = classNames('switchBtn', {
      'txbtn-active': this.state.currentContent === 'success'
    })
    const revokebtn = classNames('switchBtn', {
      'txbtn-active': this.state.currentContent === 'revoke'
    })
    

   
    return (
      <div className="tx-comp">
          <div className="txbtns">
              <button className={pendingbtn} onClick={()=> {
                this.setState({
                  currentContent: 'pending'
                })
                
                
              }}>Pending Tx</button> 
              <button className={successbtn} onClick={()=> {
                this.setState({
                  currentContent: 'success'
                })
                this.props.viewExecutedList();
            
              }}>Executed Tx</button>
              <button className={revokebtn}
              onClick={()=> {
                this.setState({
                  currentContent: 'revoke'
                })
                this.props.viewRevokedList();
              }}>Revoked Tx</button>
         </div>
         {content}
          
      </div>
    );
  }
}

export default TransactionsPage;
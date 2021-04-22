import React, { Component } from "react";
import Owners from './OwnersList';


import "../App.css";

class BoardHome extends Component {
  state = { 
    recipientAddress: '',
    amount: ''
   };

    
  handleRecipientAddress=(e)=> {
    this.setState({
      recipientAddress: e.target.value
    })

    
  }

  handleAmount=(e)=> {
    this.setState({
      amount: e.target.value
    })
    
  }

  handleSubmit=(e)=>{
    e.preventDefault();


    this.props.proposeTransaction(this.state.recipientAddress, this.state.amount);
    
  }


  render() {
   
    return (
      <div className="dashHome">
          <Owners 
          ownersArray={this.props.ownersArray}
          confirmations={this.props.confirmations}/>
          <form className="addTxForm form" onSubmit={this.handleSubmit}>
            <h3>Propose Transaction</h3>

            <input type="text" 
            placeholder="address 0x00...." onChange={this.handleRecipientAddress}/>
            <input type="text" 
            placeholder="amount" onChange={this.handleAmount}/>
            <button type="submit" className="form-button submitTx">Submit TX</button>

        </form>
          
        
      </div>
    );
  }
}

export default BoardHome;

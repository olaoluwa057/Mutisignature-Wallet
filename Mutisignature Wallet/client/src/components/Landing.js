import React, { Component } from "react";
import '../App.css';

class Landing extends Component {
    
   state={
        ownersArray: null,
        confirmations: null
   }
    
    handleOwnersAddresses=(e)=> {
        //convert address list to String
        const owners = String(e.target.value);
        //split init individual element in an array
        const ownersArray = owners.split(" ");
        //set state
        this.setState({
            ownersArray
        })
        
        
    }

    handleNumConfirmations=(e)=> {
        const confirmations = e.target.value;
        this.setState({
            confirmations
        })

    }

    deployOnSubmit =(e)=> {
        e.preventDefault();
        this.props.deployContract(this.state.ownersArray, this.state.confirmations);
        this.props.changeCurrentComponent(e);

        console.log(this.state.ownersArray)
    }

    render(){
        return(
            <div className="landingPage">
                <form className="deploy-form" onSubmit={this.deployOnSubmit}>
                    <h3>Web3Bridge MultiSig Wallet</h3>
                    <p>You need to set List of Owners and Required Confirmations</p>
                    <input placeholder="Addrs1 Addrs2 .... Addrs n" className="accts-input" onChange={this.handleOwnersAddresses}/>
                    <input placeholder="Required Confirmations, E.g- 3" className="confirmations-input" onChange={this.handleNumConfirmations}/>
                    <button type="submit" className="createWallet-btn">Create Wallet</button>
                </form>
            </div>
        )

    }

    
}

export default Landing;
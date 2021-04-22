import React from "react";
import "../App.css";
import { Table } from "react-bootstrap";

const SuccessfulTx =(props)=> {


  const initials = props.executedList;
    const initialSolved = Object.values(initials);
    const transactions = []
    const transactionsList = []

    initialSolved.map(solved=> {
      transactions.push(solved)
    })

    Object.values(transactions).forEach(transaction=>{
      transaction.forEach((item, i)=>{
        transactionsList[i] = transactionsList[i] || [];
        transactionsList[i].push(item);
      })
      
   })


    const renderSuccessfulTx=transactionsList.map((transaction, key) => {
      //console.log(transactionsList.indexOf(transaction), 'key o')

      return(
          <tr key={transaction[4]} className="tx-details">
              <td>{transaction[0].slice(0,4).concat('...').concat(transaction[0].slice(14,18)) }</td>
              <td>{transaction[1].slice(0,4).concat('...').concat(transaction[1].slice(14,18)) }</td>
              <td>{transaction[2]/10**18} Eth</td>
              <td>{transaction[3]}</td>
              <td>{transaction[4]}</td> 
              <td> <img src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png" /></td>  
            </tr>

      );
      
        
    })

    let content;

    if(!transactionsList.length){
      content = <span className="loader-content">You currently have no transactions to be display</span>
    }else{
      content = renderSuccessfulTx
    }
  

    return (
      <div className="tx-table-div">
            <h3>Executed Transactions</h3>
            
            <Table responsive="lg" striped className="tx-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>amount</th>
                    <th>Confirmations</th>
                    <th>ID</th> 
                    <th></th>   
                  </tr>
                </thead>
                <tbody>
                  {content}
                </tbody>
              </Table>  
      </div>
    );
   
  
}

export default SuccessfulTx;
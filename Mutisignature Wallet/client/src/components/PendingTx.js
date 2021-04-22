import React from "react";
import "../App.css";
import { Table } from "react-bootstrap";


const PendingTx = (props)=> {
  
    const initials = props.pendingTx;
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


   
   

    const renderPendingTx=transactionsList.map((transaction, key) => {
      //console.log(transactionsList.indexOf(transaction), 'key o')
       
      return(
          <tr key={transaction[4]} className="tx-details">
              <td>{transaction[0].slice(0,4).concat('...').concat(transaction[0].slice(14,18)) }</td>
              <td>{transaction[1].slice(0,4).concat('...').concat(transaction[1].slice(14,18)) }</td>
              <td>{transaction[2]/10**18} Eth</td>
              <td>{transaction[3]}</td>
              <td>{transaction[4]}</td>
              <td><button onClick={()=> {
                props.approveTx(transaction[4])
              }}>approve</button></td>
              
              <td><button onClick={()=> {
                props.executeTx(transaction[4])
              }}>Execute</button></td>

              <td><button className="revoke-btn"
              onClick={()=> {
                props.revokeTx(transaction[4])
              }}>revoke</button></td> 
               
            </tr>

      );
      
        
    })


    let content;

    if(!transactionsList.length){
      content = <span className="loader-content">You currently have no transactions to be display</span>
    }else{
      content = renderPendingTx
    }
  

    return (
      <div className="Pendingtx-comp tx-table-div">
            <h3>Pending Transactions</h3>
            
            <Table responsive="lg" striped className="tx-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Recipient</th>
                    <th>amount</th>
                    <th>Confirmations</th>
                    <th>ID</th>
                    <th> </th>
                    <th></th>
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

export default PendingTx;
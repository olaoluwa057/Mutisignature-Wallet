import React from "react";

import "../App.css";

const OwnersList=(props)=> {

   const owners = props.ownersArray;
   
   const list = owners.map(owner=> {
     return(
       <div className="owners">
         
         <p className="owner-address">
           {owner}
         </p>

       </div>
     )
   }) 
    return (
      <div className="owners-list">
          <span> Owners</span>
          {list}
        
        <span>Required Confirmation: <span className="confirmation-no">{props.confirmations}</span> </span>
      </div>
    );
  
}

export default OwnersList;
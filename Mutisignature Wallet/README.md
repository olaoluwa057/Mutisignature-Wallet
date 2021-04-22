# ConsensysAcad-MultiSig
A multiSignature wallet written in Solidity. Frontend implemented with react and web3js. You can define owners and set number of confirmations required for a transaction to be executed.

# To run local Project locally,
This a truffle-unbox-react project.
"cd client" and "npm start" to start local server

With the current state of the App, you will have to set "list of owners" and "confirmations required" manually in the code,(this file will be updated once this is fixed)
* go into the app.js file, 
* uncomment line 155 to deploy contract,(this calls the deployContract function upon Component Mount)
* define owners  by inputting  addresses(say 3 or 4) from metamask in the ownersArray variable on line 92
* define confirmations on line 96
* save to refresh app- you should see a metamask pop up confirmation 
* you should also see an error stating the contract has no address. Recall the deployContract function that was called- it console.log the contract address, so all you need do is open up your console and you'd find the multisig wallet address- copy it and go to your app.js file, on line 79, uncomment the contractAddress variable and paste in the address.
*  VERY IMPORTANT- comment the deployContract function on line 114 to avoid deploying contract again
* save to refresh App. You should see your list of owners, cofirmations, wallet Address and balance. 
* You can send some ether to your multiSigWallet and go ahead to submit a transaction. Click on the icons on side bar to switch to transactions page to confirm and execute/revoke transactions

# Link to video
https://youtu.be/4izW-DJtNUE


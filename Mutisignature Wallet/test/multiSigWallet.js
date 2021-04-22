
 const MultiSigWallet = artifacts.require('MultiSigWallet.sol');

 contract("MultiSigWallet", accounts=> {
    const owners = [accounts[0], accounts[1], accounts[2]];
    const requiredConfirmations = 2;  
    let wallet;

    before(async()=> {
        wallet = await MultiSigWallet.new(owners, requiredConfirmations);
    })
 
    //new wallet should be created
    //since wallet is deployed by user- its vital to test that wallet is created properly, hence we check that address is not empty 
    it("should deploy wallet", async()=> {  
        const walletAddress = wallet._address;
        assert(walletAddress != '');
    })

    //this is a multisigwallet that requires only owners to execute any transaction, hence a test to ensure that inputed owners are the actual owners in the app

    it("should return correct list of owners", async()=> {
        const res = await wallet.viewOwners();
        assert.deepEqual(res, owners);
    })

    // A test to check that a transaction is submitted and included in transaction list

    it("Should submit a transaction properly", async()=> {
       const res= await wallet.proposeTransaction(accounts[4], 1, 0x00, {from: owners[0]});
       
       const{ logs } = res;
        assert(logs[0].event = "TransactionProposed");
        const txOnTxList = await wallet.transactions(0);
        assert(logs[0].args.owner == txOnTxList.txSender);
        assert(logs[0].args.destination == txOnTxList.destination);
        assert(logs[0].args.amount.toNumber() === txOnTxList.amount.toNumber());
        assert(logs[0].args.transactionId.toNumber() === txOnTxList.txId.toNumber());
    })



    //a test to approve transaction- this means no. of confirmations will increase
    it("should approve a transaction", async()=> {
        await wallet.proposeTransaction(accounts[4], 1, 0x00, {from: owners[0]});
        await wallet.approveTransaction(0, {from: owners[2]} );
         const res = await wallet.approveTransaction(0, {from: owners[1]} );
       
        const {logs} = res;
        assert(logs[0].args.event = "TransactionApproved");
        const tx = await wallet.transactions(0); 
        assert(tx.isApproved = true);
        assert(tx.noOfConfirmations.toNumber() == 2);
    })


    // a test to ensure a non-owner cannot propose any transaction

    it("should throw an error if none owner tries to submit a transaction", async()=> {
       
        
        
       try{

             await wallet.proposeTransaction(accounts[4], 0, "0x0", {from: accounts[5]});

        }

        catch (e){
            assert(e.message.includes("You are not part of owners"));
        } 

    }) 

 })
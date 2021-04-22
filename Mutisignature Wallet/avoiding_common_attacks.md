1. ReentrancyGuard - from openzeppelin
One of the major dangers of calling external contracts is that they 
can take over the control flow, and make changes to your data that 
the calling function wasn't expecting, hence the need to have this implemented

 2. Restricting Access
 This is a MultiSigWallet that requires only someone who is part of the owners
 to be able to participate in executing transactions hence the need to implement
 restricting access to certain functions to only owners.
# Design Patterns used in this Project
 * Circuit Breaker design pattern
 This allows to freeze certain functions in contract when a bug is detected. This was
 implemented on the executeTransaction function.

 * Restricting Access
 This is a MultiSigWallet that requires only someone who is part of the owners
 to be able to participate in executing transactions hence the need to implement
 restricting access to certain functions to only owners.



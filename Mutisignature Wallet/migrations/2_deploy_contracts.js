var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

module.exports = function(deployer) {

  //deployer.deploy(MultiSigWallet);

  deployer.deploy(MultiSigWallet, ["0x5ff14f30422365110e41007fce02b2442d037f1e", "0xc14550531907125e6c2b701b7dbb2ff2d879628c","0x78ba3086c05f20c9c8f03729c0be17e503485bee"], 2 )
};

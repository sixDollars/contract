var rand    = artifacts.require("RandomLottery");
var lottery = artifacts.require("lottery");

module.exports = function(deployer) {
  deployer.deploy(rand);
  deployer.link(rand,lottery);
  deployer.deploy(lottery);
};

var FundRaise = artifacts.require("./FundRaise");
var Ballot = artifacts.require("./Ballot");
var Podo = artifacts.require("./Podo");

module.exports = async function(deployer) {
  await deployer.deploy(Podo);
  await deployer.deploy(Ballot);
  await deployer.deploy(FundRaise, Podo.address, Ballot.address);
};

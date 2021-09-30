var FundRaise = artifacts.require("./FundRaise");
var Ballot = artifacts.require("./Ballot");
var Podo = artifacts.require("./Podo");
var TimeLock = artifacts.require("./TimeLock");
var Governor = artifacts.require("./Governor");

module.exports = async function(deployer) {
  const admin = "0x51AA32D176b0dF3D1Af9E3Cfc9605977bFC52547"
  await deployer.deploy(Podo);
  await deployer.deploy(Ballot);
  await deployer.deploy(TimeLock, admin, 177200);
  await deployer.deploy(FundRaise, Podo.address, Ballot.address);
  await deployer.deploy(Governor, Podo.address, Ballot.address, FundRaise.address,  TimeLock.address);
};

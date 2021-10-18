var Campaign = artifacts.require("./Campaign");
var Podo = artifacts.require("./Podo");
var Governor = artifacts.require("./Governor");
var Group = artifacts.require("./Group");

module.exports = async function(deployer) {
  const admin = "0x51AA32D176b0dF3D1Af9E3Cfc9605977bFC52547"
  await deployer.deploy(Podo, {from: admin});
  await deployer.deploy(Group, {from: admin});
  await deployer.deploy(Campaign, Podo.address, Group.address, {from: admin});
  await deployer.deploy(Governor, Podo.address, Group.address, Campaign.address, {from: admin});
};

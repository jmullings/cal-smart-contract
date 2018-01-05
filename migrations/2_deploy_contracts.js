// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
//
// module.exports = function(deployer) {
//   deployer.deploy(SimpleStorage);
// };
var SmartContractTest = artifacts.require("./SmartContractTest.sol");

module.exports = function(deployer) {
    deployer.deploy(SmartContractTest,111, {gas: 4500000});
};
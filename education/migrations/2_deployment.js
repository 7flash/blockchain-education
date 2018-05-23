const Course = artifacts.require("./Course.sol");
const CourseRegistry = artifacts.require("./CourseRegistry.sol");

module.exports = function(deployer, network, accounts) {
    let courseRegistry;

  deployer.then(function() {
    return deployer.deploy(CourseRegistry);
  }).then(function(instance) {
     courseRegistry = instance;
  });
};
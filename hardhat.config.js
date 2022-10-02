require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
      blockGasLimit: 100000000429720,
      allowUnlimitedContractSize: true
    },
  }
};

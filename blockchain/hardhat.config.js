require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  // add mumbai network and its config
  // also add private key of metamask account
  // that we will use to deploy contracts
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/gwAnLFRBVMxcUt2s_ivoEpU5g4wte8-r",
      accounts: ["c885615e6b3059857af6f7005df6c952249915c334c8f8f5f185e5886479d7c5"],
    },
  },
};

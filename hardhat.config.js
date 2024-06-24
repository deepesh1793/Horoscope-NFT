require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "Amoy",
  networks: {
    hardhat: {},
    Amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

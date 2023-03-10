import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import invariant from "tiny-invariant";

const { PLOYGON_TEST_NET_URL, PRIVATE_KEY } = process.env;

invariant(PLOYGON_TEST_NET_URL, "PLOYGON_TEST_NET_URL is not defined");
invariant(PRIVATE_KEY, "PRIVATE_KEY is not defined");

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon: {
      url: PLOYGON_TEST_NET_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;

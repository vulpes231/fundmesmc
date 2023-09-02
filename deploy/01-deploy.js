const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    });
};

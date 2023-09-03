const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
    let fundMe;
    let myDeployer;
    let mockV3Aggregator;
    beforeEach(async function () {
        console.log("deploying....");
        const { deployer } = await getNamedAccounts();
        myDeployer = deployer;
        console.log(myDeployer);
        await deployments.fixture();

        console.log("deploying FundMe....");
        fundMe = await ethers.getContract("FundMe", myDeployer);
        console.log("Deployed FundMe address:", fundMe.address);
        console.log(
            "Price Feed address in FundMe:",
            await fundMe.getPriceFeed(),
        );

        console.log("deploying MockV3....");
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            myDeployer,
        );
        console.log(
            "Deployed MockV3Aggregator address:",
            mockV3Aggregator.address,
        );
    });

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const res = await fundMe.getPriceFeed();
            assert.equal(res, mockV3Aggregator.address);
        });
    });
});

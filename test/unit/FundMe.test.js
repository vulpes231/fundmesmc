const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
    let fundMe;
    let myDeployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");

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

    describe("fund", async function () {
        it("Fails if eth amount is low", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!",
            );
        });

        it("Updates the amount data struct", async function () {
            await fundMe.fund({ value: sendValue });
            const res = await fundMe.getAddressToAmountFunded(myDeployer);
            assert.equal(res.toString(), sendValue.toString());
        });

        it("Updates funders array with the sender", async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.getFunder(0);
            assert.equal(funder, myDeployer);
        });
    });
});

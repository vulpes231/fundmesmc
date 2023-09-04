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

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });
        it("Withdraw ETH from a single founder", async function () {
            const startingContractBal = await fundMe.provider.getBalance(
                fundMe.address,
            );

            const startingDeployerBal =
                await fundMe.provider.getBalance(myDeployer);

            const txResponse = await fundMe.withdraw();
            const txReceipt = await txResponse.wait(1);

            const { gasUsed, effectiveGasPrice } = txReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const endingContractBal = await fundMe.provider.getBalance(
                fundMe.address,
            );

            const endingDeployerBal =
                await fundMe.provider.getBalance(myDeployer);

            assert.equal(endingContractBal, 0);
            assert.equal(
                startingContractBal.add(startingDeployerBal),
                endingDeployerBal.add(gasCost).toString(),
            );
        });
    });
});

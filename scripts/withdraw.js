const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContractAt("FundMe", deployer);
    const txResponse = await fundMe.withdraw();

    await txResponse.wait(1);

    console.log("Funds withdrawn!");
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

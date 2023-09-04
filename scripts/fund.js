const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContractAt("FundMe", deployer);
    console.log("funding contract...");

    const txResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    });

    await txResponse.wait(1);
    console.log("funded!");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

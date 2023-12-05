const { run } = require("hardhat");
const contracts = require("../contracts.json");

async function main() {
    const jobs = [
        run("verify:verify", {
            address: contracts.cryptoPunk
        }),
        run("verify:verify", {
            address: contracts.shinseiGalverse
        }),
        run("verify:verify", {
            address: contracts.erc6551Account
        }),
        run("verify:verify", {
            address: contracts.erc6551Registry
        }),
    ];

    await Promise.all(jobs.map((job) => job.catch(console.log)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

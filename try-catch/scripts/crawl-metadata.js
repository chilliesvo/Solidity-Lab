const { crawlAndUpdateAnimationMetadata } = require("../utils/crawl-metadata");
const { contractFactoriesLoader } = require("../utils/deploy.utils");

async function main() {
    //** NFT */

    //** Contract Factories */
    const { } = await contractFactoriesLoader();

    //** Crawl and update animation */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

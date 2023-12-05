const { crawlAndUpdateAnimationMetadata } = require("../utils/crawl-metadata");
const { contractFactoriesLoader } = require("../utils/deploy.utils");

async function main() {
    //** NFT */
    const SHINSEIGALVERSE = "0x1DAA4453f1fAC26832Fac85C804084f6b0468c9c";

    //** Contract Factories */
    const { ShinseiGalverse } = await contractFactoriesLoader();

    //** Crawl and update animation */
    const nft = await ShinseiGalverse.attach(SHINSEIGALVERSE);
    const baseUri = "https://galverse.art/api/metadata";
    const quantity = 50;
    await crawlAndUpdateAnimationMetadata(nft, baseUri, quantity);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

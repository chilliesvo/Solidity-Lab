require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const { ethers } = require("hardhat");
const { IFRAME_API } = process.env;

async function crawlAndUpdateAnimationMetadata(tokenObject, tokenBaseUri, quantity) {
    const network = await ethers.provider.getNetwork();
    const tokenName = await tokenObject.name();
    const tokenAddress = await tokenObject.address;
    try {
        for (let i = 1; i <= quantity; ++i) {
            const api = `${tokenBaseUri}/${i}.json`;
            const { data: metadata } = await axios.get(api);
            metadata.animation_url = `${IFRAME_API}/${tokenAddress}/${i}/${network.chainId}?disableloading=true&logo=galverse`;
            const dir = `./metadata/${tokenName}/`;
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            await fs.writeFileSync(`${dir}/${i}.json`, JSON.stringify(metadata));
        }
    } catch (err) {
        console.error('err :>> ', err);
    }

}

module.exports = { crawlAndUpdateAnimationMetadata };

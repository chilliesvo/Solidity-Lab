const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { genNumbersASC } = require("../utils/utils");

describe("TokenBoundAccount", () => {
    before(async () => {
        //** Get Wallets */
        const accounts = await ethers.getSigners();
        [account1, account2] = accounts;

        //** Create NFT */
        const ShinseiGalverse = await ethers.getContractFactory("ShinseiGalverse");
        nft = await ShinseiGalverse.deploy();

        await nft.mint(account1.address, 10);
        //** Create ERC-6551 Registry */
        const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
        registryTBA = await ERC6551Registry.deploy();

        //** Create ERC-6551 implement */
        const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
        accountTBA = await ERC6551Account.deploy();
    });

    describe("Registry account", () => {
        const salt = 0;
        const chainId = 1;
        it("Should create account and emit AccountCreated", async () => {
            const account = await registryTBA.account(accountTBA.address, chainId, nft.address, 1, salt);
            const initData = [];

            await expect(registryTBA.createAccount(accountTBA.address, chainId, nft.address, 1, salt, initData))
                .to
                .emit(registryTBA, "AccountCreated")
                .withArgs(account, accountTBA.address, chainId, nft.address, 1, salt);
        });
    });
});

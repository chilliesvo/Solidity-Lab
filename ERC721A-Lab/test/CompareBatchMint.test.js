const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { genNumbersASC } = require("../utils/utils");

describe("CompareBatchMint", () => {
    before(async () => {
        //** Get Wallets */
        const accounts = await ethers.getSigners();
        [user1, user2] = accounts;

        //** Get contracts deployed  */
        const Test721A = await ethers.getContractFactory("Test721A");
        erc721a = await Test721A.deploy();

        const Test721 = await ethers.getContractFactory("Test721");
        erc721 = await Test721.deploy();

        const Test721AutoIncrementId = await ethers.getContractFactory("Test721AutoIncrementId");
        erc721AutoIncrementId = await Test721AutoIncrementId.deploy();

        const Test721Enumerable = await ethers.getContractFactory("Test721Enumerable");
        erc721Enumerable = await Test721Enumerable.deploy();

        tokenId = 0;
    });

    describe("Compare Gas Batch Mint", () => {
        it("Batch mint 721a", async () => {
            let tx = await erc721a.connect(user1).mint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721a", async () => {
            let tx = await erc721a.connect(user1).safeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721", async () => {
            const tokenIds = genNumbersASC(1, 50);
            let tx = await erc721.connect(user1).BatchMint(user1.address, tokenIds);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721", async () => {
            const tokenIds = genNumbersASC(51, 100);
            let tx = await erc721.connect(user1).BatchSafeMint(user1.address, tokenIds);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721AutoIncrementId", async () => {
            let tx = await erc721AutoIncrementId.connect(user1).BatchMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721AutoIncrementId", async () => {
            let tx = await erc721AutoIncrementId.connect(user1).BatchSafeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721Enumerable", async () => {
            let tx = await erc721Enumerable.connect(user1).BatchMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721Enumerable", async () => {
            let tx = await erc721Enumerable.connect(user1).BatchSafeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });
    });
});

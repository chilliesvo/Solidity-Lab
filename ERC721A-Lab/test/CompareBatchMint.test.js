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
        const ERC721ASafeMock = await ethers.getContractFactory("ERC721ASafeMock");
        erc721a = await ERC721ASafeMock.deploy();

        const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
        erc721 = await ERC721Mock.deploy();

        const ERC721AutoIncrementIdMock = await ethers.getContractFactory("ERC721AutoIncrementIdMock");
        erc721AutoIncrementId = await ERC721AutoIncrementIdMock.deploy();

        const ERC721EnumerableMock = await ethers.getContractFactory("ERC721EnumerableMock");
        erc721Enumerable = await ERC721EnumerableMock.deploy();

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
            let tx = await erc721.connect(user1).batchMint(user1.address, tokenIds);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721", async () => {
            const tokenIds = genNumbersASC(51, 100);
            let tx = await erc721.connect(user1).batchSafeMint(user1.address, tokenIds);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721AutoIncrementId", async () => {
            let tx = await erc721AutoIncrementId.connect(user1).batchMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721AutoIncrementId", async () => {
            let tx = await erc721AutoIncrementId.connect(user1).batchSafeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721Enumerable", async () => {
            let tx = await erc721Enumerable.connect(user1).batchMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721Enumerable", async () => {
            let tx = await erc721Enumerable.connect(user1).batchSafeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });
    });
});

const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

describe("CompareSingleMint", () => {
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

    describe("Compare Gas Mint", () => {
        it("mint 721a", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721a.connect(user1).mint(user1.address, 1);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("safeMint 721a", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721a.connect(user1).safeMint(user1.address, 1);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("mint 721", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721.connect(user1).mint(user1.address, ++tokenId);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("safeMint 721", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721.connect(user1).safeMint(user1.address, ++tokenId);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("mint 721AutoIncrementId", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721AutoIncrementId.connect(user1).mint(user1.address);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("safeMint 721AutoIncrementId", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721AutoIncrementId.connect(user1).safeMint(user1.address);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("mint 721Enumerable", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721Enumerable.connect(user1).mint(user1.address);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });

        it("safeMint 721Enumerable", async () => {
            await Promise.all(Array(3).fill().map(async () => {
                let tx = await erc721Enumerable.connect(user1).safeMint(user1.address);
                tx = await tx.wait();
                console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
            }))
        });
    });
});

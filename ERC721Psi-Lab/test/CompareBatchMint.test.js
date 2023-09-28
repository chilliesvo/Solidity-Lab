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
        const Test721Psi = await ethers.getContractFactory("Test721Psi");
        erc721Psi = await Test721Psi.deploy();

        const Test721A = await ethers.getContractFactory("Test721A");
        erc721a = await Test721A.deploy();
    });

    describe("Compare Gas Batch Mint", () => {
        it("Batch mint 721Psi", async () => {
            let tx = await erc721Psi.connect(user1).mint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch safeMint 721Psi", async () => {
            let tx = await erc721Psi.connect(user1).safeMint(user1.address, 50);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

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
    });
});

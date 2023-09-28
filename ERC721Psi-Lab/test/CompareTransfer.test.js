const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { genNumbersASC } = require("../utils/utils");

describe("CompareTransfer", () => {
    before(async () => {
        //** Get Wallets */
        const accounts = await ethers.getSigners();
        [user1, user2, user3] = accounts;

        //** Get contracts deployed  */
        const Test721Psi = await ethers.getContractFactory("Test721Psi");
        erc721Psi = await Test721Psi.deploy();

        const Test721A = await ethers.getContractFactory("Test721A");
        erc721a = await Test721A.deploy();
    });

    describe("Compare Gas Batch Mint", () => {
        it("Batch mint 721Psi", async () => {
            let tx = await erc721Psi.connect(user1).mint(user1.address, 500);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Transfer 721Psi", async () => {
            let tx = await erc721Psi.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 499);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 498);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 497);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 496);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            //===============

            tx = await erc721Psi.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 499);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 498);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 497);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721Psi.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 496);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Batch mint 721A", async () => {
            let tx = await erc721a.connect(user1).mint(user1.address, 500);
            tx = await tx.wait();
            expect(await erc721a.balanceOf(user1.address)).to.equal(500);
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });

        it("Transfer 721A", async () => {
            let tx = await erc721a.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 499);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 498);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 497);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 496);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            //===============

            tx = await erc721a.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 499);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 498);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 497);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());

            tx = await erc721a.connect(user2)["safeTransferFrom(address,address,uint256)"](user2.address, user1.address, 496);
            tx = await tx.wait();
            console.log('tx.gasUsed :>> ', tx.gasUsed.toString());
        });
    });
});

const { ethers } = require("hardhat");
const { expect } = require("chai");

const MAX_UINT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

describe("UnderflowOverflow", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [caller1, caller2, receiver] = signers;

        const Overflow = await ethers.getContractFactory("Overflow");
        const Underflow = await ethers.getContractFactory("Underflow");

        overflow = await Overflow.deploy();
        underflow = await Underflow.deploy();
    });

    describe("overflow", () => {
        it("transfer", async () => {
            await overflow.connect(caller1).depositMax();
            await overflow.connect(caller2).depositMax();

            expect(await overflow.userBalances(caller1.address)).to.eq(MAX_UINT);

            try {
                await overflow.connect(caller2).transfer(caller1.address, 1);
            } catch (err) {
                console.log('err :>> ', err);
            }

            expect(await overflow.userBalances(caller1.address)).to.eq(0);
        })
    });

    describe("underflow", () => {
        it("decreaseBalance", async () => {
            expect(await underflow.userBalances(caller1.address)).to.eq(0);
            await expect(underflow.withdraw(100)).to.revertedWith("not enough eth to withdraw");

            try {
                await underflow.connect(caller1).decreaseBalance();
            } catch (err) {
                console.log('err :>> ', err);
            }

            expect(await underflow.userBalances(caller1.address)).to.eq(MAX_UINT);
            await underflow.withdraw(100);
        })
    });
});

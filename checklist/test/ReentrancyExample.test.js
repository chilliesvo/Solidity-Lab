const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils.js");
const { getBalance } = require("../utils/utils");

describe("Reentrancy attack", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [account1, account2, account3] = signers;

        const Victim = await ethers.getContractFactory("Victim");
        const Attacker = await ethers.getContractFactory("Attacker");

        victim = await Victim.deploy();
        attacker = await Attacker.deploy(victim.address);
    });

    describe("attack victim", () => {
        it("users deposit", async () => {
            await victim.connect(account1).deposit({ value: parseEther("100") });
            await victim.connect(account2).deposit({ value: parseEther("200") });

            expect(await victim.connect(account1).getBalance()).to.eq(parseEther("100"));
            expect(await victim.connect(account2).getBalance()).to.eq(parseEther("200"));

            expect(await getBalance(victim.address)).to.eq(parseEther("300"));
        });

        it("users withdraw all", async () => {
            await expect(victim.connect(account3).withdrawAll()).to.revertedWith("not enough eth to withdraw");
        })

        it("attack", async () => {
            await attacker.connect(account3).attack({ value: parseEther("1") });

            expect(await getBalance(victim.address)).to.eq(parseEther("0"));


            expect(await victim.connect(account1).getBalance()).to.eq(parseEther("100"));
            expect(await victim.connect(account2).getBalance()).to.eq(parseEther("200"));

            await expect(victim.connect(account1).withdrawAll()).to.revertedWith("withdraw fail");
            await expect(victim.connect(account2).withdrawAll()).to.revertedWith("withdraw fail");
        })
    });
});

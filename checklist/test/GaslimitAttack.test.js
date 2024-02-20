const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getBalance, parseEther, getGasUsed } = require("../utils/utils");

describe("Gaslimit attack", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [account1, account2, account3] = signers;

        const GaslimitVictim = await ethers.getContractFactory("GaslimitVictim");

        victim = await GaslimitVictim.deploy();

        //add payees
        const userTotal = 2000;
        await Promise.all(Array(userTotal).fill(account2.address).map(async user => {
            await victim.addPayee(user, { value: parseEther(0.01) });
        }))
        expect(await victim.getPayeeLength()).to.eq(userTotal);
    });

    describe("check gaslimit", () => {
        it("pay out insecure", async () => {
            try {
                await victim.payOutInsecure();
            } catch (err) {
                expect(err.message).to.eq("Transaction ran out of gas");
            }
        });

        it("pay out", async () => {
            const tx = await victim.payOut();
            const gasUse = await getGasUsed(tx);
            console.log('gasUse :>> ', gasUse);
        });
    });
});

const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getEvent, getBalance, sendETHFrom, parseEther } = require("../utils/utils.js");

describe("Call", () => {
    beforeEach(async () => {
        const signers = await ethers.getSigners();
        [account1] = signers;

        const Called = await ethers.getContractFactory("Called");
        const Caller = await ethers.getContractFactory("Caller");

        called = await Called.deploy();
        caller = await Caller.deploy();

        // deposit 10ETH to Caller
        await sendETHFrom(account1, caller.address, 10);
    });

    describe("Call", () => {
        it("Should return false when call a function not exists", async () => {
            // Prepare encoded data to be used in a function call
            const ABI = ["function functionNonExist()"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("functionNonExist", []);
            const tx = await caller.callCalledWithPayload(called.address, payload);
            const { success, data } = await getEvent(tx, "CallCalled");
            expect(success).to.eq(false);
            expect(data).to.eq("0x")
        });

        it("Should return false when call a function wrong parameter", async () => {
            // Prepare encoded data to be used in a function call
            const ABI = ["function plus(string)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("plus", ["number"]);
            const tx = await caller.callCalledWithPayload(called.address, payload);
            const { success, data } = await getEvent(tx, "CallCalled");
            expect(success).to.eq(false);
            expect(data).to.eq("0x")
        });

        it("Should return false when call a function wrong logic", async () => {
            // Prepare encoded data to be used in a function call
            const ABI = ["function div(uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("div", [0]);
            const tx = await caller.callCalledWithPayload(called.address, payload);
            const { success, data } = await getEvent(tx, "CallCalled");
            const dataDecoded = ethers.utils.defaultAbiCoder.decode(['uint256'], data);
            expect(success).to.eq(false);
            expect(data).to.not.eq("0x")
        });

        it("Should number equal 1 and emit CallCalled", async () => {
            // check number before call
            expect(await called.number()).to.eq(0);

            // call function callCalled
            const tx = await caller.callCalled(called.address);
            const { success, data } = await getEvent(tx, "CallCalled");
            const dataDecoded = ethers.utils.defaultAbiCoder.decode(['uint256'], data);

            // check emit event
            expect(success).to.eq(true);
            expect(Number(dataDecoded)).to.eq(1);

            // check number after called
            expect(await called.number()).to.eq(1);
        });
    });

    describe("sentEther", () => {
        it("Should sent ether to Called and emit SentEther", async () => {
            // check before balance of Called balance
            expect(await getBalance(called.address)).to.eq(0);

            const tx = await caller.sendEther(called.address, 1000);
            const { success, data } = await getEvent(tx, "SentEther");
            expect(success).to.eq(true);
            expect(data).to.eq("0x");

            // check after balance of Called balance
            expect(await getBalance(called.address)).to.eq(1000);
        })
    })
});
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");

describe("Delegatecall", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [account1] = signers;

        const Called = await ethers.getContractFactory("CalledV2");
        const Caller = await ethers.getContractFactory("CallerV2");

        called = await Called.deploy();
        caller = await Caller.deploy(called.address);

    });

    describe("callSetNumber", () => {
        it("", async () => {
            await caller.callSetNumber(12);

            const callerNumber = await caller.number();
            console.log('callerNumber :>> ', callerNumber);

            const callerAddress = await caller.called();
            console.log('callerAddress :>> ', callerAddress);

            const calledNumber = await called.number();
            console.log('calledNumber :>> ', calledNumber);
        });
    });
});

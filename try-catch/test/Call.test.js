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

    })
});
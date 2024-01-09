const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("TryCatch", () => {
    beforeEach(async () => {
        const signers = await ethers.getSigners();
        [account1] = signers;

        const Called = await ethers.getContractFactory("Called");
        const Token = await ethers.getContractFactory("ERC20Mock");
        const Caller = await ethers.getContractFactory("Caller");

        called = await Called.deploy();
        token = await Token.deploy();
        caller = await Caller.deploy(called.address, token.address);
    });

    describe("try", () => {
        it("", async () => {
        })
    })

    describe.only("catch", () => {
        it("catchRequire", async () => {
            await expect(caller.catchRequire()).to.emit(caller, "CatchLog").withArgs("zero less than one");
        })

        it("catchDivByZero", async () => {
            await expect(caller.catchDivByZero()).to.emit(caller, "CatchLog").withArgs("18");
        })

        it("catchOverFlow", async () => {
            await expect(caller.catchOverFlow()).to.emit(caller, "CatchLog").withArgs("17");
        })

        it.skip("transferSomeTokens", async () => {
            // await token.mint(caller.address, 100);
            await caller.transferSomeTokens(account1.address);
        })
    })
});

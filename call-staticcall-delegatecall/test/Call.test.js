const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getEvent, getBalance, sendETHFrom, parseEther, getEstimateGas, getGasUsed, formatEther } = require("../utils/utils.js");
const { BigNumber } = require("ethers");

describe("Call", () => {
    beforeEach(async () => {
        const signers = await ethers.getSigners();
        [account1] = signers;

        const Called = await ethers.getContractFactory("Called");
        const Caller = await ethers.getContractFactory("Caller");

        called = await Called.deploy();
        caller = await Caller.deploy(called.address);
    });

    describe("callCalledWithPayload", () => {
        it("Should return false when call a function not exists", async () => {
            // Prepare encoded data to be used in a function call
            const ABI = ["function functionNonExist()"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("functionNonExist", []);
            const tx = await caller.callCalledWithPayload(payload);
            const { success, data } = await getEvent(tx, "Response");
            expect(success).to.eq(false);
            expect(data).to.eq("0x")
        });

        it("Should call success true", async () => {
            // check number called before set
            expect(await called.number()).to.eq(0);

            // Prepare encoded data to be used in a function call
            const ABI = ["function setNumber(uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("setNumber", [10]);
            const tx = await caller.callCalledWithPayload(payload);
            const { success, data } = await getEvent(tx, "Response");
            const dataDecoded = ethers.utils.defaultAbiCoder.decode(['uint256'], data);
            expect(success).to.eq(true);
            expect(Number(dataDecoded)).to.eq(10);

            // check number called after set
            expect(await called.number()).to.eq(10);
        });
    });

    describe("sentEther", () => {
        it("Should sent ether to Called and emit Response", async () => {
            // deposit 10ETH to Caller
            await sendETHFrom(account1, caller.address, 1000);

            // check before balance of Called
            expect(await getBalance(called.address)).to.eq(0);

            const tx = await caller.sendEther(called.address, 1000);
            const { success, data } = await getEvent(tx, "Response");
            expect(success).to.eq(true);
            expect(data).to.eq("0x");

            // check after balance of Called
            expect(await getBalance(called.address)).to.eq(1000);
        })

        it("Should sent ether and update number to Called", async () => {
            // deposit 10ETH to Caller
            await sendETHFrom(account1, caller.address, 1000);
            expect(await getBalance(caller.address)).to.eq(1000);

            // check before balance of Called
            expect(await getBalance(called.address)).to.eq(0);

            // check number called before set
            expect(await called.number()).to.eq(0);

            // Prepare encoded data to be used in a function call
            const ABI = ["function setNumber(uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("setNumber", [111]);

            // call transaction
            const tx = await caller.sendEtherWithPayload(called.address, payload, { value: 1000 });

            const { success, data } = await getEvent(tx, "Response");
            let dataDecoded;
            if (success) dataDecoded = ethers.utils.defaultAbiCoder.decode(['uint256'], data);

            // check returns data
            expect(success).to.eq(true);
            expect(Number(dataDecoded)).to.eq(111);

            // check after balance of Called
            expect(await getBalance(called.address)).to.eq(1000);

            // check number called after set
            expect(await called.number()).to.eq(111);
        })
    })

    describe("sentEther with gas", () => {
        it("Should call fail if gas very low", async () => {
            // Prepare encoded data to be used in a function call
            const ABI = ["function setNumber(uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("setNumber", [111]);

            // call transaction
            const gas = 20000;
            const tx = await caller.sendEtherWithGas(called.address, gas, payload, { value: 1000 });

            const { success } = await getEvent(tx, "Response");

            // check returns data
            expect(success).to.eq(false);
        })

        it("Should sent ether and update number to Called", async () => {
            // deposit 10ETH to Caller
            await sendETHFrom(account1, caller.address, 1000);
            expect(await getBalance(caller.address)).to.eq(1000);

            // check before balance of Called
            expect(await getBalance(called.address)).to.eq(0);

            // check number called before set
            expect(await called.number()).to.eq(0);

            // Prepare encoded data to be used in a function call
            const ABI = ["function setNumber(uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("setNumber", [111]);

            // call transaction
            const gas = 30000;
            const tx = await caller.sendEtherWithGas(called.address, gas, payload, { value: 1000 });


            const { success, data } = await getEvent(tx, "Response");
            let dataDecoded;
            if (success) dataDecoded = ethers.utils.defaultAbiCoder.decode(['uint256'], data);

            // check returns data
            expect(success).to.eq(true);
            expect(Number(dataDecoded)).to.eq(111);

            // check after balance of Called
            expect(await getBalance(called.address)).to.eq(1000);

            // check number called after set
            expect(await called.number()).to.eq(111);
        })
    })
});

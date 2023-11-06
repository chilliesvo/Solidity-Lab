const { ethers } = require("hardhat");
const { expect } = require("chai");
const FooAbi = require("../artifacts/contracts/Foo.sol/Foo.json");
const BarAbi = require("../artifacts/contracts/Bar.sol/Bar.json");
const { parseEther, getBalance, getEvent } = require("../utils/utils");

const getCountFunction = 'getCount()';
const setCountFunction = 'setCount(uint256)';
const nonExistentFuncSignature = 'nonExistentFunction()';


describe('fallback', function () {
  beforeEach(async function () {
    const signers = await ethers.getSigners();
    [deployer] = signers;
    const Foo = await ethers.getContractFactory("Foo");
    const Bar = await ethers.getContractFactory("Bar");
    bar = await Bar.deploy(10);
    foo = await Foo.deploy(bar.address);

    fakeDemoContract = new ethers.Contract(
      bar.address,
      [
        ...bar.interface.fragments,
        `function ${nonExistentFuncSignature}`,
      ],
      deployer
    );
  });

  it('should invoke the fallback function', async () => {
    let tx = await fakeDemoContract[getCountFunction]();
    tx = await fakeDemoContract[nonExistentFuncSignature]();
    const event = await getEvent(tx, "Track");
    console.log('event :>> ', event);
  });

  it.only('should invoke the receive function', async () => {
    // expect(await bar.getCount()).to.eq(10);
    const tx = await deployer.sendTransaction({
      to: bar.address,
      value: parseEther(1),
    });
    console.log('object :>> ', (await tx.wait()).logs[0]);

    // const event = await getEvent(tx, "Track");
    // console.log('event :>> ', event);
    expect(await getBalance(bar.address)).to.eq(parseEther(1));
    // expect((await tx.wait()).gasUsed).to.eq(21000);
    // expect(await bar.getCount()).to.eq(parseEther(1));
  });
});

const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");

describe("Marketplace", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [owner, buyer] = signers;

        //deploy contracts
        const NFT = await ethers.getContractFactory("ERC721Mock");
        nft = await NFT.deploy();

        const Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy(nft.address);

        //mint token
        await nft.mint(owner.address, 10);
        await nft.connect(owner).setApprovalForAll(marketplace.address, true);
        expect(await nft.balanceOf(owner.address)).to.eq(10);

    });

    describe("purchase NFT", () => {
        it("should pay to nft owner and transfer nft to buyer", async () => {
            expect(await nft.ownerOf(1)).to.eq(owner.address);

            await expect(() => marketplace.connect(buyer).purchaseItem(buyer.address, 1, { value: parseEther("0.01") }))
                .to
                .changeEtherBalances([owner, buyer], [parseEther('0.01'), parseEther('0.01').mul(-1)]);

            expect(await nft.ownerOf(1)).to.eq(buyer.address);
        });
    });
});

// data out-of-bounds 
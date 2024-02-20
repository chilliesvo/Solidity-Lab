const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getBalance, parseEther, ZERO_ADDRESS } = require("../utils/utils");

describe("RevertAttack", () => {
    before(async () => {
        const signers = await ethers.getSigners();
        [player1, player2, owner1, owner2, attacker] = signers;

        const RevertVictim = await ethers.getContractFactory("RevertVictim");
        const RevertAttacker = await ethers.getContractFactory("RevertAttacker");

        revertVictim = await RevertVictim.deploy();
        revertAttacker = await RevertAttacker.connect(attacker).deploy(revertVictim.address);

        changeOwnerFee = await revertVictim.changeOwnerFee();
        playFee = await revertVictim.playFee();
    });

    describe("everything was normal before the attack", () => {
        it("should change owner with owner1 successfully", async () => {
            //current owner should be equal zero address
            expect(await revertVictim.owner()).to.eq(ZERO_ADDRESS);

            //current balance victim contract is zero
            expect(await getBalance(revertVictim.address)).to.eq(0);

            //change owner with owner1
            await revertVictim.connect(owner1).changeOwner({ value: changeOwnerFee });

            //current owner after changed should be owner1
            expect(await revertVictim.owner()).to.eq(owner1.address);

            //current balance victim contract after changed owner
            expect(await getBalance(revertVictim.address)).to.eq(changeOwnerFee);
        })

        it("players enjoy game and pay fee to play game owner1", async () => {
            //bonus should be equal zero before play game
            expect(await revertVictim.bonus()).to.eq(0);

            //user play game
            await revertVictim.connect(player1).playgame({ value: playFee });
            await revertVictim.connect(player2).playgame({ value: playFee });

            //check bonus after play
            expect(await revertVictim.bonus()).to.eq(playFee.mul(2));
        })

        it("owner1 withdraw bonus successfully", async () => {
            //should be revert if caller is not owner
            await expect(revertVictim.connect(owner2).withdrawBonus()).to.revertedWith("caller is not owner");

            //withdraw bonus successfully
            const currentBonus = await revertVictim.bonus();
            await expect(() => revertVictim.connect(owner1).withdrawBonus())
                .to
                .changeEtherBalances([revertVictim, owner1], [currentBonus.mul(-1), currentBonus]);
        })

        it("owner2 change owner with owner1 successfully", async () => {
            //change owner1 to owner2
            await expect(() => revertVictim.connect(owner2).changeOwner({ value: changeOwnerFee }))
                .to
                .changeEtherBalances([owner1, owner2], [changeOwnerFee, changeOwnerFee.mul(-1)]);

            //owner should be owner2
            expect(await revertVictim.owner()).to.eq(owner2.address);
        })

        it("players enjoy game and pay fee to play game owner2", async () => {
            //bonus should be equal zero before play game
            expect(await revertVictim.bonus()).to.eq(0);

            //user play game
            await revertVictim.connect(player1).playgame({ value: playFee });
            await revertVictim.connect(player2).playgame({ value: playFee });

            //check bonus after play
            expect(await revertVictim.bonus()).to.eq(playFee.mul(2));
        })

        it("owner2 withdraw bonus successfully", async () => {
            //should be revert if caller is not owner
            await expect(revertVictim.connect(owner1).withdrawBonus()).to.revertedWith("caller is not owner");

            //withdraw bonus successfully
            const currentBonus = await revertVictim.bonus();
            await expect(() => revertVictim.connect(owner2).withdrawBonus())
                .to
                .changeEtherBalances([revertVictim, owner2], [currentBonus.mul(-1), currentBonus]);
        })
    });

    describe("attacker using the smart contract to change owner", () => {
        it("should change owner with smart contract successfully", async () => {
            //current owner should be owner2 address
            expect(await revertVictim.owner()).to.eq(owner2.address);

            //change owner with smart contract
            await revertAttacker.connect(attacker).changeOwner({ value: changeOwnerFee });

            //current owner after changed should be owner1
            expect(await revertVictim.owner()).to.eq(revertAttacker.address);

            //current balance victim contract after changed owner
            expect(await getBalance(revertVictim.address)).to.eq(changeOwnerFee);
        })

        it("players enjoy game and pay fee to play game attacker", async () => {
            //bonus should be equal zero before play game
            expect(await revertVictim.bonus()).to.eq(0);

            //user play game
            await revertVictim.connect(player1).playgame({ value: playFee });
            await revertVictim.connect(player2).playgame({ value: playFee });

            //check bonus after play
            expect(await revertVictim.bonus()).to.eq(playFee.mul(2));
        })

        it("attacker withdraw bonus successfully", async () => {
            //withdraw bonus successfully
            const currentBonus = await revertVictim.bonus();
            await expect(() => revertAttacker.connect(attacker).withdrawBonus())
                .to
                .changeEtherBalances([revertVictim, attacker], [currentBonus.mul(-1), currentBonus]);
        })

        it("another user cannot change the owner", async () => {
            await expect(revertVictim.connect(owner1).changeOwner({ value: changeOwnerFee })).to.revertedWith("change fail");
        })
    });
});

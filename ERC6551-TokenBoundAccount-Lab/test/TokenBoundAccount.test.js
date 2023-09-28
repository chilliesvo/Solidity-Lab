const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { genNumbersASC } = require("../utils/utils");

describe("TokenBoundAccount", () => {
    before(async () => {
        //** Get Wallets */
        const accounts = await ethers.getSigners();
        [user1, user2] = accounts;


    });

    describe("", () => {
        it("", async () => {
        });
    });
});

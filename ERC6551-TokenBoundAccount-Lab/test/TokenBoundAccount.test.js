const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther, sendETHFrom, getBalance } = require("../utils/utils");

describe("TokenBoundAccount", () => {
    const salt = 0;
    const tokenId = 1;
    before(async () => {
        const network = await ethers.provider.getNetwork();
        chainId = network.chainId;

        //** get Wallets */
        const signers = await ethers.getSigners();
        [account1, account2, ...accounts] = signers;

        //** create NFT721 */
        const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
        erc721 = await ERC721Mock.deploy();
        await erc721.mint(account2.address, 5);

        //** create NFT1155 */
        const ERC1155Mock = await ethers.getContractFactory("ERC1155Mock");
        erc1155 = await ERC1155Mock.deploy();
        await erc1155.mint(account2.address, 5);

        //** create ERC20 */
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        erc20 = await ERC20Mock.deploy();
        await erc20.mint(account2.address, 1000);

        //** create ERC-6551 Registry */
        const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
        registryTBA = await ERC6551Registry.deploy();

        //** create ERC-6551 implement */
        TBAMock = await ethers.getContractFactory("TBAMock");
        customTBA = await TBAMock.deploy();
    });

    describe("Registry account", () => {
        it("Should create account and emit AccountCreated", async () => {
            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);
            const initData = [];

            await expect(registryTBA.createAccount(customTBA.address, chainId, erc721.address, tokenId, salt, initData))
                .to
                .emit(registryTBA, "AccountCreated")
                .withArgs(accountAddress, customTBA.address, chainId, erc721.address, tokenId, salt);
        });

        it("Owner account should be owner of erc721 ID created", async () => {
            expect(await erc721.ownerOf(tokenId)).to.eq(account2.address);

            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);
            const initData = [];

            await registryTBA.createAccount(customTBA.address, chainId, erc721.address, tokenId, salt, initData);
            const account = await TBAMock.attach(accountAddress);
            expect(await account.owner()).to.eq(account2.address);
        })
    });

    describe("Transfer other token to TBA", () => {
        it("Transfer ETH to TBA", async () => {
            //get TBA address
            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

            //transfer token to TBA
            await sendETHFrom(account2, accountAddress, 100);

            //Check TBA balance
            expect(await getBalance(accountAddress)).to.eq(parseEther(100));
        })

        it("Transfer ERC721 to TBA", async () => {
            //get TBA address
            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

            //transfer token to TBA
            await erc721.connect(account2).transferFrom(account2.address, accountAddress, 2);

            //Check TBA balance
            expect(await erc721.ownerOf(2)).to.eq(accountAddress);
        })

        it("Transfer ERC1155 to TBA", async () => {
            //Mint token
            expect(await erc1155.balanceOf(account2.address, 1)).to.eq(5);

            //get TBA address
            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

            //transfer token to TBA
            await erc1155.connect(account2).safeTransferFrom(account2.address, accountAddress, 1, 5, []);

            //Check TBA balance
            expect(await erc1155.balanceOf(accountAddress, 1)).to.eq(5);
        })

        it("Transfer ERC20 to TBA", async () => {
            //get TBA address
            const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

            //before transfer
            expect(await erc20.balanceOf(account2.address)).to.eq(1000);
            expect(await erc20.balanceOf(accountAddress)).to.eq(0);

            //transfer 10000 token to TBA
            await erc20.connect(account2).transfer(accountAddress, 1000);

            //after transfer
            expect(await erc20.balanceOf(account2.address)).to.eq(0);
            expect(await erc20.balanceOf(accountAddress)).to.eq(1000);
        })
    })

    describe("Transfer token from TBA to other address", () => {
        context("Transfer ETH from TBA to other", () => {
            it("Should return Not token owner if caller is not owner of TBA token ID", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //transfer
                expect(await tba.owner()).to.not.eq(account1.address);
                await expect(tba.connect(account1).executeCall(account2.address, 10, [])).to.revertedWith("Not token owner");
            })

            it("Should transfer ETH to account2 successfully", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //transfer
                expect(await tba.owner()).to.eq(account2.address);
                await expect(() => tba.connect(account2).executeCall(account2.address, 10, []))
                    .to
                    .changeEtherBalances([tba, account2], [-10, 10]);
            })
        })

        context("Transfer ERC721 from TBA to other", () => {
            it("Should return caller is not the owner if caller is not owner of TBA token ID", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //transfer
                expect(await tba.owner()).to.not.eq(account1.address);
                await expect(tba.connect(account1).transferNFT(erc721.address, account2.address, 2, 1)).to.revertedWith("caller is not the owner");
            })

            it("Should transfer ERC721 to account2 successfully", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //before transfer
                expect(await erc721.ownerOf(2)).to.eq(accountAddress);

                //transfer
                expect(await tba.owner()).to.eq(account2.address);
                await tba.connect(account2).transferNFT(erc721.address, account2.address, 2, 1);

                //after transfer
                expect(await erc721.ownerOf(2)).to.eq(account2.address);
            })
        })

        context("Transfer ERC1155 from TBA to other", () => {
            it("Should return caller is not the owner if caller is not owner of TBA token ID", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //transfer
                expect(await tba.owner()).to.not.eq(account1.address);
                await expect(tba.connect(account1).transferNFT(erc1155.address, account2.address, 1, 5)).to.revertedWith("caller is not the owner");
            })

            it("Should transfer ERC1155 to account2 successfully", async () => {
                //get TBA address
                const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                //attach TBA
                const tba = await TBAMock.attach(accountAddress);

                //before transfer
                expect(await erc1155.balanceOf(account2.address, 1)).to.eq(0);
                expect(await erc1155.balanceOf(accountAddress, 1)).to.eq(5);

                //transfer
                expect(await tba.owner()).to.eq(account2.address);
                await tba.connect(account2).transferNFT(erc1155.address, account2.address, 1, 5);

                //after transfer
                expect(await erc1155.balanceOf(account2.address, 1)).to.eq(5);
                expect(await erc1155.balanceOf(accountAddress, 1)).to.eq(0);
            })

            context("Transfer ERC20 from TBA to other", async () => {
                it("Should return caller is not the owner if caller is not owner of TBA token ID", async () => {
                    //get TBA address
                    const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                    //attach TBA
                    const tba = await TBAMock.attach(accountAddress);

                    //transfer
                    expect(await tba.owner()).to.not.eq(account1.address);
                    await expect(tba.connect(account1).transferToken(erc20.address, account2.address, 1000)).to.revertedWith("caller is not the owner");
                })

                it("Should transfer ERC20 to account2 successfully", async () => {
                    //get TBA address
                    const accountAddress = await registryTBA.account(customTBA.address, chainId, erc721.address, tokenId, salt);

                    //attach TBA
                    const tba = await TBAMock.attach(accountAddress);

                    //before transfer
                    expect(await erc20.balanceOf(account2.address)).to.eq(0);
                    expect(await erc20.balanceOf(accountAddress)).to.eq(1000);

                    //transfer
                    expect(await tba.owner()).to.eq(account2.address);
                    await tba.connect(account2).transferToken(erc20.address, account2.address, 1000);

                    //after transfer
                    expect(await erc20.balanceOf(account2.address)).to.eq(1000);
                    expect(await erc20.balanceOf(accountAddress)).to.eq(0);
                })
            })
        })
    })
});

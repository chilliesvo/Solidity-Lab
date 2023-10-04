const { deployContract, offsettedIndex } = require('./helpers.js');
const { expect } = require('chai');
const { genNumbersASC } = require('../utils/utils.js');

const createTestSuite = ({ contract, constructorArgs }) =>
    function () {
        let offsetted;

        context(`${contract}`, function () {
            before(async function () {
                const signers = await ethers.getSigners();
                [user1, user2, user3] = signers;
                this.erc721aQueryable = await deployContract(contract, constructorArgs);
                this.startTokenId = (await this.erc721aQueryable.startTokenId()).toNumber()
                offsetted = (...arr) => offsettedIndex(this.startTokenId, arr);
            });

            context('with owner tokenIds when transfer', async function () {
                it('has 0 totalSupply', async function () {
                    const supply = await this.erc721aQueryable.totalSupply();
                    expect(supply).to.equal(0);
                });

                it('has 50 totalSupply after batch mint 50 tokens', async function () {
                    await this.erc721aQueryable.safeMint(user1.address, 50);
                    const supply = await this.erc721aQueryable.totalSupply();
                    expect(supply).to.equal(50);
                });

                it('user1 has token ids from 1 to 50', async function () {
                    const ownerIds = await getOwnerIds(this.erc721aQueryable, user1.address);
                    expect(ownerIds).to.have.all.members(genNumbersASC(1, 50));
                })

                it('user1 has token ids 26->50 when transfer 1->25 to user2', async function () {
                    await batchTransferFrom(this.erc721aQueryable, user1.address, user2.address, genNumbersASC(1, 25));
                    const ownerIds = await getOwnerIds(this.erc721aQueryable, user1.address);
                    expect(ownerIds).to.have.all.members(genNumbersASC(26, 50));
                })
            });
        });
    };

describe('ERC721AQueryable', createTestSuite({ contract: 'ERC721AQueryableStartTokenIdMock', constructorArgs: ['Azuki', 'AZUKI', 1] }));

async function getOwnerIds(erc721aQueryable, owner) {
    const ownerIds = await erc721aQueryable.tokensOfOwner(owner);
    return ownerIds.map(id => Number(id));
}

async function batchTransferFrom(erc721aQueryable, from, to, tokenIds) {
    await Promise.all(tokenIds.map(async (id) => {
        await erc721aQueryable["safeTransferFrom(address,address,uint256)"](from, to, id);
    }))
}
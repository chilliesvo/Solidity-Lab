const { deployContract } = require('./helpers.js');
const { expect } = require('chai');
const { genNumbersASC } = require('../utils/utils.js');

const createTestSuite = ({ contract, constructorArgs }) =>
    function () {
        context(`${contract}`, function () {
            before(async function () {
                const signers = await ethers.getSigners();
                [user1, user2, user3] = signers;
                this.erc721Enumrable = await deployContract(contract, constructorArgs);
            });

            context('with owner tokenIds when transfer', async function () {
                it('has 0 totalSupply', async function () {
                    const supply = await this.erc721Enumrable.totalSupply();
                    expect(supply).to.equal(0);
                });

                it('has 50 totalSupply after batch mint 50 tokens', async function () {
                    await this.erc721Enumrable.batchMint(user1.address, 50);
                    const supply = await this.erc721Enumrable.totalSupply();
                    expect(supply).to.equal(50);
                });

                it('user1 has token ids from 1 to 50', async function () {
                    const ownerIds = await getOwnerIds(this.erc721Enumrable, user1.address);
                    expect(ownerIds).to.have.all.members(genNumbersASC(1, 50));
                })

                it('user1 has token ids 26->50 when transfer 1->25 to user2', async function () {
                    await this.erc721Enumrable.batchTransfer(user2.address, genNumbersASC(1, 25));
                    const ownerIds = await getOwnerIds(this.erc721Enumrable, user1.address);
                    expect(ownerIds).to.have.all.members(genNumbersASC(26, 50));
                })
            });
        });
    };

describe('ERC721EnumerableQueryable', createTestSuite({ contract: 'ERC721EnumerableMock', constructorArgs: [] }));

async function getOwnerIds(erc721Enumrable, owner) {
    const balance = Number(await erc721Enumrable.balanceOf(owner));
    const ownerIds = await Promise.all(Array(balance).fill().map(async (_, index) => {
        const id = await erc721Enumrable.tokenOfOwnerByIndex(user1.address, index)
        return Number(id);
    }
    ));
    return ownerIds;
}
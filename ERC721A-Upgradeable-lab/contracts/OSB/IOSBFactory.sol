//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IOSBFactory {
    function createCollection(
        bool _isSingle,
        address _owner,
        address _controller,
        CollectionInput memory _collectionInput
    ) external returns (address);
}

struct ContractInfo {
    uint256 id;
    bool isSingle;
    address owner;
    address token;
}

struct CollectionInput {
    string contractUri;
    string name;
    string symbol;
    address defaultReceiverRoyalty;
    uint96 defaultPercentageRoyalty;
    uint256 maxTotalSupply;
}

struct RoyaltyInput {
    address receiver;
    uint96 percentage;
}

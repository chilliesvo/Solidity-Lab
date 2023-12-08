// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Mock is ERC1155("https://ipfs/.json") {
    string public name;
    string public symbol;
    uint256 public lastId;

    constructor() {
        name = "ERC1155 Mock";
        symbol = "ERC1155";
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, ++lastId, _amount, "");
    }

    function batchMint(address[] memory _accounts, uint256[] memory _amounts) external {
        require(_accounts.length == _amounts.length, "accounts and amounts miss match");
        for (uint256 i = 0; i < _accounts.length; ++i) {
            mint(_accounts[i], _amounts[i]);
        }
    }
}

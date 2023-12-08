// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() ERC20("ERC20 Mock", "ERC20") {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function batchMint(address[] memory _accounts, uint256[] memory _amounts) external {
        for (uint256 i = 0; i < _accounts.length; ++i) {
            _mint(_accounts[i], _amounts[i]);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() ERC20("ERC20 Mock", "ERC20") {
        mint(msg.sender);
    }

    function mint(address _to) public {
        _mint(_to, 1000 * 10 ** decimals());
    }

    function batchMint(address[] memory _accounts) external {
        for (uint256 i = 0; i < _accounts.length; ++i) {
            _mint(_accounts[i], 1000 * 10 ** decimals());
        }
    }
}

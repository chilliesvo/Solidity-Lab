// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721("ERC721 Mock", "ERC721") {
    uint256 public lastId;

    function mint(address _to) external {
        _mint(_to, ++lastId);
    }
}

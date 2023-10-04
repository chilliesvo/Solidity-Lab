pragma solidity ^0.8.4;

import "./ERC721A/ERC721A.sol";

contract ERC721ASafeMock is ERC721A("Azuki", "721A") {
    function mint(address _to, uint256 _quantity) external {
        _mint(_to, _quantity);
    }

    function safeMint(address _to, uint256 _quantity) external {
        _safeMint(_to, _quantity, "");
    }
}

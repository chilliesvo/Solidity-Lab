pragma solidity ^0.8.4;

import "erc721psi/contracts/ERC721Psi.sol";

contract Test721Psi is ERC721Psi("ERC721Psi", "721PSI") {
    function mint(address _to, uint256 _quantity) external {
        _mint(_to, _quantity);
    }

    function safeMint(address _to, uint256 _quantity) external {
        _safeMint(_to, _quantity, "");
    }
}

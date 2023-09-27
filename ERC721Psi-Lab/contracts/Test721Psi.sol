pragma solidity ^0.8.4;

import "erc721psi/contracts/ERC721Psi.sol";

contract Test721Psi is ERC721Psi("ERC721Psi", "721PSI") {
    uint256 public lastId;

    function mint(address _to) external {
        _mint(_to, ++lastId);
    }

    function safeMint(address _to) external {
        _safeMint(_to, ++lastId);
    }

    function BatchMint(address _to, uint256 _quantity) external {
        for (uint256 i = 0; i < _quantity; ++i) {
            _mint(_to, ++lastId);
        }
    }

    function BatchSafeMint(address _to, uint256 _quantity) external {
        for (uint256 i = 0; i < _quantity; ++i) {
            _safeMint(_to, ++lastId);
        }
    }
}

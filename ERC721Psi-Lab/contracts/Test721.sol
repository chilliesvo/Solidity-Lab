pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Test721 is ERC721("Simple 721", "721") {
    function mint(address _to, uint256 _tokenId) external {
        _mint(_to, _tokenId);
    }

    function safeMint(address _to, uint256 _tokenId) external {
        _safeMint(_to, _tokenId);
    }

    function BatchMint(address _to, uint256[] memory _tokenIds) external {
        for (uint256 i = 0; i < _tokenIds.length; ++i) {
            _mint(_to, _tokenIds[i]);
        }
    }

    function BatchSafeMint(address _to, uint256[] memory _tokenIds) external {
        for (uint256 i = 0; i < _tokenIds.length; ++i) {
            _safeMint(_to, _tokenIds[i]);
        }
    }
}

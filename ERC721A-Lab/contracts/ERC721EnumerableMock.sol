pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ERC721EnumerableMock is ERC721Enumerable {
    uint256 public lastId;

    constructor() ERC721("Simple", "721") {}

    function mint(address _to) external {
        _mint(_to, ++lastId);
    }

    function safeMint(address _to) external {
        _safeMint(_to, ++lastId);
    }

    function batchMint(address _to, uint256 _quantity) external {
        for (uint256 i = 0; i < _quantity; ++i) {
            _mint(_to, ++lastId);
        }
    }

    function batchSafeMint(address _to, uint256 _quantity) external {
        for (uint256 i = 0; i < _quantity; ++i) {
            _safeMint(_to, ++lastId);
        }
    }

    function batchTransfer(address _to, uint256[] memory _tokenIds) external {
        for (uint256 i = 0; i < _tokenIds.length; ++i) {
            _transfer(_msgSender(), _to, _tokenIds[i]);
        }
    }
}

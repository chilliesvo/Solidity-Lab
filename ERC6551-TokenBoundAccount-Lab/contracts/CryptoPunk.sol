//SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoPunk is ERC721, Ownable {
    using Strings for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant MAX_SUPPLY = 8888;
    string public _baseURIextended =
        "https://chocolate-flexible-rattlesnake-777.mypinata.cloud/ipfs/QmR7Nzm9nzAFiA6SboVsSCphT8FdfHTcfAoEU2rZKVp1iG/";

    constructor() ERC721("CryptoPunk", "PUNK") {}

    function setBaseURI(string memory baseURI_) external {
        _baseURIextended = baseURI_;
    }

    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(_baseURIextended, "metadata.json"));
    }

    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= _tokenIds.current(), "Nonexistent token");
        return string(abi.encodePacked(_baseURIextended, tokenId.toString(), ".json"));
    }

    function mint(address _to, uint256 _amount) external returns (uint256) {
        for (uint256 i = 0; i < _amount; ++i) {
            _tokenIds.increment();
            _mint(_to, _tokenIds.current());
        }
        return _tokenIds.current();
    }
}

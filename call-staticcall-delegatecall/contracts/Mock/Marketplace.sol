// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    address public nft;
    event Bought(address indexed nft, address indexed buyer, uint256 tokenId, uint256 price);

    constructor(address _nft) {
        nft = _nft;
    }

    function purchaseItem(address _to, uint256 _tokenId) external payable nonReentrant {
        require(msg.value == 0.01 ether, "not enought value");
        // Transfer nft to buyer.
        IERC721(nft).safeTransferFrom(owner(), _to, _tokenId);

        // Transfer eth to owner.
        (bool _success, ) = owner().call{value: msg.value}("");
        require(_success, "pay failed");

        emit Bought(nft, _to, _tokenId, msg.value);
    }

    function setNFT(address _nft) external {
        nft = _nft;
    }
}

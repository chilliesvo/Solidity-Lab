// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../ERC6551Account.sol";
import "../lib/NFTChecker.sol";

contract TBAMock is ERC6551Account {
    string public name;
    string public symbol;
    uint256 public lastId;

    constructor() {}

    event TransferNFT(address indexed _nft, address indexed _to, uint256 indexed _tokenId, uint256 _amount);
    event TransferToken(address indexed _token, address indexed _to, uint256 _amount);

    function transferNFT(address _nft, address _to, uint256 _tokenId, uint256 _amount) external {
        if (NFTChecker.isERC721(_nft)) {
            require(_amount == 1, "invalid amount");
            IERC721(_nft).safeTransferFrom(address(this), _to, _tokenId);
        } else {
            require(_amount > 0, "invalid amount");
            IERC1155(_nft).safeTransferFrom(address(this), _to, _tokenId, _amount, "");
        }

        emit TransferNFT(_nft, _to, _tokenId, _amount);
    }

    function transferToken(address _token, address _to, uint256 _amount) external {
        IERC20(_token).transfer(_to, _amount);
        emit TransferToken(_token, _to, _amount);
    }
}

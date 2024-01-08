// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "../ERC6551Account.sol";
import "../lib/NFTChecker.sol";

contract TBAMock is ERC721Holder, ERC1155Holder, Context, ERC6551Account {
    string public name;
    string public symbol;
    uint256 public lastId;

    constructor() {}

    event TransferNFT(address indexed _nft, address indexed _to, uint256 indexed _tokenId, uint256 _amount);
    event TransferToken(address indexed _token, address indexed _to, uint256 _amount);

    modifier onlyOwner() {
        require(_msgSender() == owner(), "Not token owner");
        _;
    }

    function transferNFT(address _nft, address _to, uint256 _tokenId, uint256 _amount) external onlyOwner {
        if (NFTChecker.isERC721(_nft)) {
            require(_amount == 1, "invalid amount");
            IERC721(_nft).safeTransferFrom(address(this), _to, _tokenId);
        } else {
            require(_amount > 0, "invalid amount");
            IERC1155(_nft).safeTransferFrom(address(this), _to, _tokenId, _amount, "");
        }

        emit TransferNFT(_nft, _to, _tokenId, _amount);
    }

    function transferToken(address _token, address _to, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(_to, _amount);
        emit TransferToken(_token, _to, _amount);
    }

    function setApprovalForAll(address _nft, address _operator, bool _approved) external onlyOwner {
        IERC721(_nft).setApprovalForAll(_operator, _approved);
    }

    function approve(address _token, address _spender, uint256 _amount) external onlyOwner {
        IERC20(_token).approve(_spender, _amount);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC6551Account, ERC1155Receiver) returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}

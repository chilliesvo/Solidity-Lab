//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol';
import '../mocks/StartTokenIdHelperUpgradeable.sol';
import '../extensions/ERC721AQueryableUpgradeable.sol';

import {RoyaltyInput, CollectionInput} from './IOSBFactory.sol';

contract OSB721A is StartTokenIdHelperUpgradeable, ERC721AQueryableUpgradeable, ERC2981Upgradeable, OwnableUpgradeable {
    RoyaltyInfo public defaultRoyaltyInfo;

    address public factory;
    uint256 public maxTotalSupply;
    mapping(address => bool) public controllers;
    mapping(uint256 => string) private _tokenURIs;

    // ============ EVENTS ============

    /// @dev Emit an event when the contract is deployed.
    event ContractDeployed(address indexed owner, address indexed controllers, CollectionInput collectionInput);

    /// @dev Emit an event when mint success.
    event MintBatch(address indexed to, uint256[] tokenIds, string[] tokenUris);

    /// @dev Emit an event when mintBatchWithRoyalty success.
    event MintBatchWithRoyalty(
        address indexed to,
        uint256[] tokenIds,
        string[] tokenUris,
        RoyaltyInput[] royaltyInputs
    );

    /// @dev Emit an event when updated controller.
    event SetController(address indexed account, bool allow);

    /// @dev Emit an event when updated new contract URI.
    event SetContractURI(string oldUri, string newUri);

    /// @dev Emit an event when updated new token URI.
    event SetTokenURI(uint256 indexed tokenId, string oldUri, string newUri);

    /**
     * @notice This function sets the initial states of the contract and is only called once at deployment.
     * @param _owner The address of the owner of the contract.
     * @param _controller The address of the controller of the contract.
     * @param _collectionInput.contractUri -> The metadata URI associated with the contract.
     * @param _collectionInput.name -> The name of the token.
     * @param _collectionInput.symbol -> The symbol used to represent the token.
     * @param _collectionInput.defaultReceiverRoyalty -> The default address that will receive the royalty for each token.
     * @param _collectionInput.defaultPercentageRoyalty -> The default percentage of royalty that will be applied per token.
     *
     * @param _collectionInput.maxTotalSupply -> The maximum total supply of tokens that can be stored by the contract.
     * Please ensure that a reasonable limit is set to prevent devaluation and harm to token holders.
     * If left as 0, it represents an unlimited maximum total supply.
     */
    function initialize(
        address _owner,
        address _controller,
        CollectionInput memory _collectionInput
    ) public initializerERC721A initializer {
        __ERC721A_init(_collectionInput.name, _collectionInput.symbol);
        __StartTokenIdHelper_init(0);
        __Ownable_init();
        transferOwnership(_owner);

        factory = _msgSender();
        _tokenURIs[0] = _collectionInput.contractUri;
        maxTotalSupply = _collectionInput.maxTotalSupply;

        if (_collectionInput.defaultReceiverRoyalty != address(0)) {
            defaultRoyaltyInfo = RoyaltyInfo(
                _collectionInput.defaultReceiverRoyalty,
                _collectionInput.defaultPercentageRoyalty
            );
            _setDefaultRoyalty(_collectionInput.defaultReceiverRoyalty, _collectionInput.defaultPercentageRoyalty);
        }

        if (_controller != address(0)) {
            controllers[_controller] = true;
        }
        emit ContractDeployed(_owner, _controller, _collectionInput);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721AUpgradeable, IERC721AUpgradeable, ERC2981Upgradeable) returns (bool) {
        return ERC721AUpgradeable.supportsInterface(interfaceId) || ERC2981Upgradeable.supportsInterface(interfaceId);
    }

    // ============ ACCESS CONTROL/SANITY MODIFIERS ============

    /**
     * @dev To check caller is owner or controller
     */
    modifier onlyOwnerOrController() {
        require(_msgSender() == owner() || controllers[_msgSender()], 'Caller not owner or controller');
        _;
    }

    /**
     * @dev To check if adding amount to the total supply exceeds the maximum allowed total supply.
     * If maxTotalSupply is greater than 0, then the function will require that the sum of the current total supply and amount
     * does not exceed maxTotalSupply. If it does, the function will revert with the error message "Exceeded maximum total supply".
     * Otherwise, the function will proceed as usual.
     */
    modifier exceededTotalSupply(uint256 amount) {
        if (maxTotalSupply > 0) {
            require(totalSupply() + amount <= maxTotalSupply, 'Exceeded maximum total supply');
        }
        _;
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============

    function setController(address _account, bool _allow) external onlyOwner {
        require(_account != address(0), 'Invalid account');
        require(controllers[_account] != _allow, 'Duplicate setting');
        controllers[_account] = _allow;

        emit SetController(_account, _allow);
    }

    /**
     * @notice Sets the metadata URI for the specified token ID.
     * @param _tokenId Token ID.
     * @param _tokenUri New Metadata URI.
     * Requirements:
     * - The specified "tokenId" must exist.
     */
    function setTokenURI(uint256 _tokenId, string memory _tokenUri) external onlyOwner {
        require(_exists(_tokenId), 'URI set of nonexistent token');
        require(bytes(_tokenUri).length > 0, 'Invalid tokenUri');
        string memory oldUri = _tokenURIs[_tokenId];
        _tokenURIs[_tokenId] = _tokenUri;
        emit SetTokenURI(_tokenId, oldUri, _tokenUri);
    }

    /**
     * @notice Updates the contract's URI to a new value.
     * @param _newUri The new URI to be set for the contract.
     */
    function setContractURI(string memory _newUri) external onlyOwner {
        require(bytes(_newUri).length > 0, 'Invalid newUri');
        string memory oldUri = _tokenURIs[0];
        _tokenURIs[0] = _newUri;
        emit SetContractURI(oldUri, _newUri);
    }

    // ============ OWNER OR CONTROLLER-ONLY FUNCTIONS ============

    function mint(address _to, string memory _tokenURI) public returns (uint256) {
        safeMint(_to, 1);
        _tokenURIs[lastId()] = _tokenURI;
        return lastId();
    }

    function safeMint(address _to, uint256 _quantity) public {
        _safeMint(_to, _quantity);
    }

    function mintBatch(
        address _to,
        string[] memory _tokenUris
    ) public exceededTotalSupply(_tokenUris.length) onlyOwnerOrController returns (uint256[] memory tokenIds) {
        require(_tokenUris.length > 0, 'Token URIs must have at least 1 item');
        tokenIds = new uint256[](_tokenUris.length);

        for (uint256 i = 0; i < _tokenUris.length; ++i) {
            tokenIds[i] = mint(_to, _tokenUris[i]);
        }

        emit MintBatch(_to, tokenIds, _tokenUris);
    }

    function mintBatchWithRoyalty(
        address _to,
        string[] memory _tokenUris,
        RoyaltyInput[] memory _royaltyInputs
    ) external onlyOwnerOrController returns (uint256[] memory tokenIds) {
        for (uint256 i = 0; i < _tokenUris.length; ++i) {
            tokenIds[i] = mint(_to, _tokenUris[i]);
            _setTokenRoyalty(tokenIds[i], _royaltyInputs[i].receiver, _royaltyInputs[i].percentage);
        }
        emit MintBatchWithRoyalty(_to, tokenIds, _tokenUris, _royaltyInputs);
    }

    // ============ OTHER FUNCTIONS =============

    /**
     * @notice Takes a tokenId and returns base64 string to represent the token metadata.
     * @param _tokenId Id of the token.
     * @return string base64
     */
    function tokenURI(
        uint256 _tokenId
    ) public view virtual override(ERC721AUpgradeable, IERC721AUpgradeable) returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function lastId() public view returns (uint256) {
        return _nextTokenId() - 1;
    }

    /**
     * @notice Returns base64 string to represent the contract metadata.
     * See https://docs.opensea.io/docs/contract-level-metadata
     * @return string base64
     */
    function contractURI() public view returns (string memory) {
        return tokenURI(0);
    }
}

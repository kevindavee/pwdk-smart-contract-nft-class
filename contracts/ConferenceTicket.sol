//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConferenceTicket is ERC721Enumerable, Ownable {
    using ECDSA for bytes32;
    using Counters for Counters.Counter;

    Counters.Counter private _ticketNumbers;

    string public baseTokenURI;
    address public nftContractAddr;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI,
        address _nftContractAddr
    )
        ERC721(name, symbol)
    {
        baseTokenURI = _baseTokenURI;
        nftContractAddr = _nftContractAddr;
        // Starting from ticket #1
        _ticketNumbers.increment();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return baseURI;
    }

    function mint(address _address) private {
        uint256 currentTicketNumber = _ticketNumbers.current();
        _safeMint(_address, currentTicketNumber);
        _ticketNumbers.increment();
    }

    function mintTicket() public {
        uint256 nftBalance = IERC721Enumerable(nftContractAddr).balanceOf(msg.sender);
        require(nftBalance > 0, "non NFT holder");
        mint(msg.sender);
    }

    function mintGroupTicket(address[] memory _addresses) public {
        require(_addresses.length == 4, "Must include 4 addresses");

        mint(msg.sender);

        for (uint256 i = 0; i < _addresses.length; i++) {
            address currAddress = _addresses[i];
            mint(currAddress);
        }
    }

    function isValidSignature(bytes32 _hash, bytes memory signature) internal view returns (bool) {
        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
        return signedHash.recover(signature) == owner();
    }

    function verify(string memory stringifiedTokens, bytes memory signature) public view {
        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, stringifiedTokens));
        require(
            isValidSignature(msgHash, signature),          
            "Invalid signature"
        );
        
        // Mark msg.sender to be able to mint group ticket
    }
}
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ConferenceTicket is ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _ticketNumbers;

    string public baseTokenURI;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI
    )
        ERC721(name, symbol)
    {
        baseTokenURI = _baseTokenURI;
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
}
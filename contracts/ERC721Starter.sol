//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PrivateSale.sol";
import "hardhat/console.sol";

contract ERC721Starter is ERC721Enumerable, PrivateSale {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string public baseTokenURI;
    uint256 public constant PRICE = 0.1 ether;

    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI,
        uint256 _privSaleStartTimestamp,
        uint256 _privSaleEndTimestamp
    )
        ERC721(name, symbol)
        PrivateSale(_privSaleStartTimestamp, _privSaleEndTimestamp)
    {
        baseTokenURI = _baseTokenURI;
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
        return bytes(baseURI).length > 0 ? baseURI : "";
    }

    function mint() public payable {
        require(msg.value == PRICE, "ether must be same as price");

        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _tokenIds.increment();
    }
}

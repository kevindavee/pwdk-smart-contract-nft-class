//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract ERC721Starter is ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public constant PRICE = 0.1 ether;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {

    }

    function mint() public payable {
        require(msg.value == PRICE, "ether must be same as price");

        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _tokenIds.increment();
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PrivateSale.sol";
import "./Airdrop.sol";
import "hardhat/console.sol";

contract ERC721Starter is ERC721Enumerable, PrivateSale, Airdrop {
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
        Airdrop()
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
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    function setBaseURI(string memory newBaseURI) public {
        baseTokenURI = newBaseURI;
    }

    function privateMint() public payable duringPrivateSale {
        require(msg.value == PRIVATE_SALE_PRICE, "ether must be same as price");
        require(addressToMintQty[msg.sender] != 0, "not allowed to mint");
        require(
            !addressToDoneMinting[msg.sender],
            "had minted during private sale"
        );

        for (uint256 i = 0; i < addressToMintQty[msg.sender]; i++) {
            mintNft(msg.sender);
        }

        addressToDoneMinting[msg.sender] = true;
    }

    function mint() public payable {
        require(msg.value == PRICE, "ether must be same as price");
        mintNft(msg.sender);
    }

    function mintNft(address addr) private {
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(addr, currentTokenId);
        _tokenIds.increment();
    }

    function claimAirdrop() public {
        require(addressToAllowedAirdrop[msg.sender], "not eligible for claiming");

        mintNft(msg.sender);
    }

    function distributeAirdrop() public onlyOwner {
        for (uint256 i = 0; i < addressesForAirdrop.length; i++) {
            address addr = addressesForAirdrop[i];
            if (addressToAllowedAirdrop[addr] && !addressToReceivedAirdrop[addr]) {
                addressToReceivedAirdrop[addr] = true;
                mintNft(addr);
            }
        }
    }
}

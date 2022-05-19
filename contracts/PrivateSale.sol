//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivateSale is Ownable {
    uint256 public privateSaleStartTimestamp;
    uint256 public privateSaleEndTimestamp;

    address[] private whitelistedAddresses;
    mapping(address => uint256) public addressToMintQty;
    mapping(address => bool) public addressToDoneMinting;

    constructor(uint256 _startTimestamp, uint256 _endTimestamp) {
        privateSaleStartTimestamp = _startTimestamp;
        privateSaleEndTimestamp = _endTimestamp;
    }

    modifier duringPrivateSale() {
        require(
            block.timestamp >= privateSaleStartTimestamp &&
                block.timestamp <= privateSaleEndTimestamp,
            "private sale has ended or not started yet"
        );
        _;
    }

    function addAddressToWhitelist(address _address, uint256 _qty)
        public
        onlyOwner
    {
        uint256 currentQty = addressToMintQty[_address];
        addressToMintQty[_address] = _qty;
        if (currentQty == 0) {
            whitelistedAddresses.push(_address);
        }
    }

    function whitelistedAddressesCount() public view returns (uint256) {
        return whitelistedAddresses.length;
    }

    function clearWhitelist() public onlyOwner {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            addressToMintQty[whitelistedAddresses[i]] = 0;
        }
    }
}

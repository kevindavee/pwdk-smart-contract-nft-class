//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivateSale is Ownable {
    address[] private whitelistedAddresses;
    mapping(address => uint256) public addressToMintQty;
    mapping(address => bool) public addressToDoneMinting;

    constructor() {}

    function addAddressToWhitelist(address _address, uint256 _qty) public onlyOwner {
        uint256 currentQty = addressToMintQty[_address];
        addressToMintQty[_address] = _qty;
        if (currentQty == 0) {
            whitelistedAddresses.push(_address);
        }
    }

    function clearWhitelist() public onlyOwner {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            addressToMintQty[whitelistedAddresses[i]] = 0;
        }
    }
}
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    address[] private addressesForAirdrop;
    mapping(address => bool) public addressToAllowedAirdrop;

    constructor() {}

    function addAddressForAirdrop(address _address) public onlyOwner {
        if (!addressToAllowedAirdrop[_address]) {
            addressToAllowedAirdrop[_address] = true;
            addressesForAirdrop.push(_address);
        }
    }
}
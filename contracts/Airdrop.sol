//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    address[] internal addressesForAirdrop;
    mapping(address => bool) public addressToAllowedAirdrop;
    mapping(address => bool) public addressToReceivedAirdrop;

    constructor() {}

    function addAddressForAirdrop(address _address) public onlyOwner {
        if (!addressToAllowedAirdrop[_address]) {
            addressToAllowedAirdrop[_address] = true;
            addressesForAirdrop.push(_address);
        }
    }
}

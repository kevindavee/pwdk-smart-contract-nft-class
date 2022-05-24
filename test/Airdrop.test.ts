import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721Starter } from "../typechain";
import { deployContract } from "./utils";

describe("Private Sale", () => {
  let contract: ERC721Starter;

  beforeEach(async () => {
    contract = await deployContract("Happy Ape Bicycle Club", "HABC");
  });

  it("should add address to mapping", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressForAirdrop(alice.address);

    const result = await contract.addressToAllowedAirdrop(alice.address);
    expect(result).to.be.equal(true);
  });
});

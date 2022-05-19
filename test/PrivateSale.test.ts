import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";
import { deployContract } from "./utils";
import { ERC721Starter } from "../typechain";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Private Sale", () => {
  let contract: ERC721Starter;

  beforeEach(async () => {
    contract = await deployContract("Happy Ape Bicycle Club", "HABC");
  });

  it("should whitelist address with correct qty", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);

    const result = await contract.addressToMintQty(alice.address);
    expect(result.toNumber()).to.be.equal(2);
  });

  it("should replace the old qty with the latest one", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);
    await contract.addAddressToWhitelist(alice.address, 3);

    const result = await contract.addressToMintQty(alice.address);
    const arrayLength = await contract.whitelistedAddressesCount();
    expect(result.toNumber()).to.be.equal(3);
    expect(arrayLength.toNumber()).to.be.equal(1);
  });

  it("should clear whitelisted addresses quantity", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);
    await contract.clearWhitelist();

    const result = await contract.addressToMintQty(alice.address);
    expect(result.toNumber()).to.be.equal(0);
  });
});

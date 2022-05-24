import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";
import { ERC721Starter } from "../typechain";
import { deployContract } from "./utils";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Airdrop", () => {
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

  it("should distribute NFT to addresses for airdrop", async () => {
    const [, alice, bob] = await ethers.getSigners();
    await contract.addAddressForAirdrop(alice.address);
    await contract.addAddressForAirdrop(bob.address);

    await contract.distributeAirdrop();

    const aliceBalance = await contract.balanceOf(alice.address);
    const bobBalance = await contract.balanceOf(bob.address);

    expect(aliceBalance.toNumber()).to.be.equal(1);
    expect(bobBalance.toNumber()).to.be.equal(1);
  });

  it("should not distribute NFT twice to addresses for airdrop", async () => {
    const [, alice, bob, charlie] = await ethers.getSigners();
    await contract.addAddressForAirdrop(alice.address);
    await contract.addAddressForAirdrop(bob.address);

    await contract.distributeAirdrop();

    await contract.addAddressForAirdrop(charlie.address);

    await contract.distributeAirdrop();

    const aliceBalance = await contract.balanceOf(alice.address);
    const bobBalance = await contract.balanceOf(bob.address);
    const charlieBalance = await contract.balanceOf(charlie.address);

    expect(aliceBalance.toNumber()).to.be.equal(1);
    expect(bobBalance.toNumber()).to.be.equal(1);
    expect(charlieBalance.toNumber()).to.be.equal(1);
  });

  it("should be able to claim NFT", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressForAirdrop(alice.address);

    await contract.connect(alice).claimAirdrop();

    const owner = await contract.ownerOf(0);
    expect(owner).to.be.eq(alice.address);
  });

  it("should not be able to claim if address is not registered", async () => {
    const [, alice] = await ethers.getSigners();

    await expect(
      contract.connect(alice).claimAirdrop()
    ).to.eventually.be.rejectedWith("not eligible for claiming");
  });

  it("should not be able to claim if address is not registered", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressForAirdrop(alice.address);

    await contract.connect(alice).claimAirdrop();

    await expect(
      contract.connect(alice).claimAirdrop()
    ).to.eventually.be.rejectedWith("airdrop has been claimed");
  });
});

import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";
import { deployContract } from "./utils";
import { ERC721Starter } from "../typechain";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("ERC721 Contract Starter", () => {
  let contract: ERC721Starter;

  beforeEach(async () => {
    contract = await deployContract("Happy Ape Bicycle Club", "HABC");
  });

  it("should mint an NFT", async function () {
    const [, alice] = await ethers.getSigners();
    const price = await contract.PRICE();
    await contract.connect(alice).mint({
      value: price,
    });
    const result = await contract.ownerOf(0);
    const contractBalance = await ethers.provider.getBalance(contract.address);
    expect(alice.address).to.be.equal(result);
    expect(contractBalance).to.be.equal(price);
  });

  it("should mint NFT for two different users", async () => {
    const [, alice, bob] = await ethers.getSigners();
    const price = await contract.PRICE();
    await contract.connect(alice).mint({
      value: price,
    });
    await contract.connect(bob).mint({
      value: price,
    });
    const aliceResult = await contract.ownerOf(0);
    const bobResult = await contract.ownerOf(1);
    const contractBalance = await ethers.provider.getBalance(contract.address);
    expect(alice.address).to.be.equal(aliceResult);
    expect(bob.address).to.be.equal(bobResult);
    expect(contractBalance).to.be.equal(price.mul(2));
  });

  it("should not mint if value provided is not the same as price", async () => {
    const [, alice] = await ethers.getSigners();
    await expect(
      contract.connect(alice).mint({
        value: ethers.utils.parseEther("0.2"),
      })
    ).to.eventually.be.rejectedWith("ether must be same as price");
  });

  it("should get the correct user balance after minting", async () => {
    const [, user1] = await ethers.getSigners();
    // Get the balance before minting
    const currentBalance = await user1.getBalance();
    // Get the price of the NFT
    const price = await contract.PRICE();
    // Mint the NFT
    const tx = await contract.connect(user1).mint({
      value: price,
    });
    // Wait for the receipt to get the gas fee
    const receipt = await tx.wait();
    // Gas fee
    const gasFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
    // Updated balance of the user (Balance - mint price - gas fee)
    expect((await user1.getBalance()).toString()).to.be.equal(
      currentBalance.sub(price).sub(gasFee)
    );
  });

  it("should return the correct URI", async () => {
    const [, alice] = await ethers.getSigners();
    const price = await contract.PRICE();
    await contract.connect(alice).mint({
      value: price,
    });
    const uri = await contract.connect(alice).tokenURI(0);
    expect(uri).to.be.equal("ipfs://myhash");

    await contract.connect(alice).setBaseURI("https://drive.google.com");
    const newUri = await contract.connect(alice).tokenURI(0);
    expect(newUri).to.be.equal("https://drive.google.com");
  });
});

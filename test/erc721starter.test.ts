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
});

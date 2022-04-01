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
    await contract.connect(alice).mint();
    const result = await contract.ownerOf(0);
    expect(alice.address).to.be.equal(result);
  });
});

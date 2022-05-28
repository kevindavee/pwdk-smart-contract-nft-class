import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";
import { ERC721Starter, ConferenceTicket } from "../typechain";
import { deployContracts } from "./utils";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Conference Ticket", () => {
  let contract: ERC721Starter;
  let conferenceContract: ConferenceTicket;

  beforeEach(async () => {
    const { confereceTicketContract, erc721StaterContract } =
      await deployContracts("Happy Ape Bicycle Club", "HABC");

    contract = erc721StaterContract;
    conferenceContract = confereceTicketContract;
  });

  it("should mint a ticket NFT for holders", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 1);
    const price = await contract.PRIVATE_SALE_PRICE();

    await contract.connect(alice).privateMint({
      value: price,
    });

    await conferenceContract.connect(alice).mintTicket();
    const result = await conferenceContract.balanceOf(alice.address);
    expect(result.toNumber()).to.be.equal(1);
  });

  it("should mint ticket NFTs for holders and 4 other addresses", async () => {
    const [, alice, bob, charlie, dan, edgar] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 1);
    const price = await contract.PRIVATE_SALE_PRICE();

    await contract.connect(alice).privateMint({
      value: price,
    });

    await conferenceContract
      .connect(alice)
      .mintGroupTicket([
        bob.address,
        charlie.address,
        dan.address,
        edgar.address,
      ]);
    const aliceResult = await conferenceContract.balanceOf(alice.address);
    const bobResult = await conferenceContract.balanceOf(bob.address);
    const charlieResult = await conferenceContract.balanceOf(charlie.address);
    const danResult = await conferenceContract.balanceOf(dan.address);
    const edgarResult = await conferenceContract.balanceOf(edgar.address);

    expect(aliceResult.toNumber()).to.be.equal(1);
    expect(bobResult.toNumber()).to.be.equal(1);
    expect(charlieResult.toNumber()).to.be.equal(1);
    expect(danResult.toNumber()).to.be.equal(1);
    expect(edgarResult.toNumber()).to.be.equal(1);
  });
});
